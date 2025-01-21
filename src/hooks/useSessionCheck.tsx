import { useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NavigateFunction } from 'react-router-dom';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useSessionCheck = (navigate: NavigateFunction) => {
  const authCheckTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const isSessionCheckRunningRef = useRef(false);

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
    if (!isSubscribed || isSessionCheckRunningRef.current) {
      console.log('Session check already running or component unmounted');
      return;
    }

    isSessionCheckRunningRef.current = true;
    console.log('Starting session check');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          console.log(`Retrying session check (${retryCountRef.current}/${MAX_RETRIES})`);
          authCheckTimeoutRef.current = setTimeout(
            () => checkSession(isSubscribed), 
            RETRY_DELAY
          );
          return;
        }
        await handleAuthError(isSubscribed);
        return;
      }

      console.log('Session check successful');
      retryCountRef.current = 0;

    } catch (error) {
      console.error('Session check error:', error);
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        authCheckTimeoutRef.current = setTimeout(
          () => checkSession(isSubscribed), 
          RETRY_DELAY
        );
        return;
      }
      await handleAuthError(isSubscribed);
    } finally {
      isSessionCheckRunningRef.current = false;
    }
  }, [handleAuthError]);

  return {
    checkSession,
    handleAuthError,
    authCheckTimeoutRef,
    isSessionCheckRunning: isSessionCheckRunningRef.current
  };
};