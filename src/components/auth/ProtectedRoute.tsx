import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { ProtectedContent } from './ProtectedContent';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const navigationAttemptedRef = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const isMountedRef = useRef(true);
  const isSessionCheckRunningRef = useRef(false);
  
  const handleSessionCheck = async () => {
    try {
      if (!isMountedRef.current || isSessionCheckRunningRef.current) {
        return;
      }

      isSessionCheckRunningRef.current = true;

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !navigationAttemptedRef.current && isMountedRef.current) {
        navigationAttemptedRef.current = true;
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Session check error:', error);
      if (!navigationAttemptedRef.current && isMountedRef.current) {
        navigationAttemptedRef.current = true;
        navigate('/', { replace: true });
      }
    } finally {
      isSessionCheckRunningRef.current = false;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Only set up the subscription if we haven't already
    if (!subscriptionRef.current && isMountedRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (!isMountedRef.current) return;
        
        if (event === 'SIGNED_OUT' && !navigationAttemptedRef.current) {
          navigationAttemptedRef.current = true;
          navigate('/', { replace: true });
        }
      });

      subscriptionRef.current = subscription;
    }

    // Initial session check with a small delay
    const sessionCheckTimeout = setTimeout(handleSessionCheck, 1000);

    return () => {
      isMountedRef.current = false;
      clearTimeout(sessionCheckTimeout);
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate]);

  return <ProtectedContent>{children}</ProtectedContent>;
};