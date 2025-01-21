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
  const isInitialCheckDoneRef = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const isMountedRef = useRef(true);
  const isSessionCheckRunningRef = useRef(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    let sessionCheckTimeout: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        if (!isMountedRef.current || isInitialCheckDoneRef.current || isSessionCheckRunningRef.current) {
          console.log('Skipping session check - already running or component unmounted');
          return;
        }

        isSessionCheckRunningRef.current = true;
        isInitialCheckDoneRef.current = true;

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session && !navigationAttemptedRef.current && isMountedRef.current) {
          console.log('No session found, navigating to auth page');
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

    // Initial session check with a delay to prevent race conditions
    sessionCheckTimeout = setTimeout(checkSession, 1000);

    // Set up auth state change listener only if not already set up
    if (!subscriptionRef.current && isMountedRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (!isMountedRef.current) return;
        
        // Only handle SIGNED_OUT events to prevent unnecessary rerenders
        if (event === 'SIGNED_OUT' && !navigationAttemptedRef.current) {
          console.log('User signed out, navigating to auth page');
          navigationAttemptedRef.current = true;
          navigate('/', { replace: true });
        }
      });

      subscriptionRef.current = subscription;
    }

    return () => {
      isMountedRef.current = false;
      clearTimeout(sessionCheckTimeout);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate]); // Only depend on navigate function

  return <ProtectedContent>{children}</ProtectedContent>;
};