import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthChangeEvent } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const authCheckTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    let isSubscribed = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const handleAuthError = async () => {
      if (!isSubscribed) return;
      
      console.log('Session invalid or expired');
      try {
        clearTimeout(authCheckTimeoutRef.current);
        await supabase.auth.signOut();
        if (isSubscribed) {
          navigate('/', { replace: true });
          toast.error("Please sign in to continue");
        }
      } catch (error) {
        console.error('Error during sign out:', error);
        if (isSubscribed) {
          toast.error("Error during sign out. Please refresh the page.");
        }
      }
    };

    const checkSession = async () => {
      if (!isSubscribed) return;

      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          handleAuthError();
          return;
        }

        if (!currentSession) {
          console.log('No active session found');
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            authCheckTimeoutRef.current = setTimeout(checkSession, 1000);
            return;
          }
          handleAuthError();
          return;
        }

        // Reset retry count on successful session check
        retryCount = 0;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User verification failed:', userError);
          handleAuthError();
        }
      } catch (error) {
        console.error('Session verification error:', error);
        handleAuthError();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, currentSession) => {
      if (!isSubscribed) return;

      console.log('Auth event:', event, currentSession ? 'Session exists' : 'No session');
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        checkSession();
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        clearTimeout(authCheckTimeoutRef.current);
        handleAuthError();
      }
    });

    // Initial session check
    checkSession();

    return () => {
      isSubscribed = false;
      clearTimeout(authCheckTimeoutRef.current);
      subscription?.unsubscribe();
    };
  }, [navigate]);

  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};