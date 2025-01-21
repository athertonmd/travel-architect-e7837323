import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { ProtectedContent } from './ProtectedContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const navigationAttemptedRef = useRef(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check in ProtectedRoute:', !!session, 'Navigation attempted:', navigationAttemptedRef.current);

        if ((error || !session) && !navigationAttemptedRef.current && isMounted) {
          navigationAttemptedRef.current = true;
          console.log('No valid session, navigating to auth');
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

    // Initial session check
    checkSession();

    // Set up auth state change listener
    if (!subscriptionRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change in ProtectedRoute:', event, !!session);
        
        if (!session && !navigationAttemptedRef.current && isMounted) {
          navigationAttemptedRef.current = true;
          console.log('Session ended, navigating to auth');
          navigate('/', { replace: true });
        }
      });

      subscriptionRef.current = subscription;
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [navigate]);

  return <ProtectedContent>{children}</ProtectedContent>;
};