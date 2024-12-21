import { useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NavigateFunction } from 'react-router-dom';

const MAX_RETRIES = 2;
const RETRY_DELAY = 800;

export const useSessionCheck = (navigate: NavigateFunction) => {
  const authCheckTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);

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
          authCheckTimeoutRef.current = setTimeout(
            () => checkSession(isSubscribed), 
            RETRY_DELAY
          );
          return;
        }
        handleAuthError(isSubscribed);
        return;
      }

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

  return {
    checkSession,
    handleAuthError,
    authCheckTimeoutRef
  };
};