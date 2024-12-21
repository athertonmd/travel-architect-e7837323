import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const authCheckTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  const handleAuthError = useCallback(async (isSubscribed: boolean) => {
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
  }, [navigate]);

  const checkSession = useCallback(async (isSubscribed: boolean) => {
    if (!isSubscribed) return;

    try {
      const { data: { session: currentSession }, error: sessionError } = 
        await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session check error:', sessionError);
        handleAuthError(isSubscribed);
        return;
      }

      if (!currentSession) {
        console.log('No active session found');
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          authCheckTimeoutRef.current = setTimeout(() => checkSession(isSubscribed), 800);
          return;
        }
        handleAuthError(isSubscribed);
        return;
      }

      // Reset retry count on successful session check
      retryCountRef.current = 0;

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User check error:', userError);
        handleAuthError(isSubscribed);
      }
    } catch (error) {
      console.error('Unexpected error during session check:', error);
      handleAuthError(isSubscribed);
    }
  }, [handleAuthError]);

  useEffect(() => {
    let isSubscribed = true;

    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        checkSession(isSubscribed);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        clearTimeout(authCheckTimeoutRef.current);
        handleAuthError(isSubscribed);
      }
    });

    // Initial session check with a small delay to allow browser to restore session
    const initialCheckTimeout = setTimeout(() => {
      checkSession(isSubscribed);
    }, 100);

    return () => {
      isSubscribed = false;
      clearTimeout(authCheckTimeoutRef.current);
      clearTimeout(initialCheckTimeout);
      subscription?.unsubscribe();
    };
  }, [checkSession, handleAuthError]);

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};