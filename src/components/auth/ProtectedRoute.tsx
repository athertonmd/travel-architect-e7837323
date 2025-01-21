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
  
  useEffect(() => {
    let isMounted = true;
    let sessionCheckTimeout: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session && !navigationAttemptedRef.current && isMounted) {
          navigationAttemptedRef.current = true;
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (!navigationAttemptedRef.current && isMounted) {
          navigationAttemptedRef.current = true;
          navigate('/', { replace: true });
        }
      }
    };

    // Initial session check with a longer delay to prevent race conditions
    sessionCheckTimeout = setTimeout(checkSession, 1000);

    // Set up auth state change listener only if not already set up
    if (!subscriptionRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        // Only handle SIGNED_OUT events to prevent unnecessary rerenders
        if (event === 'SIGNED_OUT' && !navigationAttemptedRef.current && isMounted) {
          navigationAttemptedRef.current = true;
          navigate('/', { replace: true });
        }
      });

      subscriptionRef.current = subscription;
    }

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(sessionCheckTimeout);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate]);

  return <ProtectedContent>{children}</ProtectedContent>;
};