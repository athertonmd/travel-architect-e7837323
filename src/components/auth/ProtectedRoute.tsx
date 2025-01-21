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
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check in ProtectedRoute:', !!session);

        if (error || !session) {
          if (!navigationAttemptedRef.current) {
            navigationAttemptedRef.current = true;
            console.log('No valid session, navigating to auth');
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (!navigationAttemptedRef.current) {
          navigationAttemptedRef.current = true;
          navigate('/', { replace: true });
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change in ProtectedRoute:', event, !!session);
      
      if (!session && !navigationAttemptedRef.current) {
        navigationAttemptedRef.current = true;
        console.log('Session ended, navigating to auth');
        navigate('/', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <ProtectedContent>{children}</ProtectedContent>;
};