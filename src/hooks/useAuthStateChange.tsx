import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

const INITIAL_CHECK_DELAY = 100;

export const useAuthStateChange = (
  isSubscribed: boolean,
  checkSession: (isSubscribed: boolean) => Promise<void>,
  handleAuthError: (isSubscribed: boolean) => Promise<void>,
  authCheckTimeoutRef: React.RefObject<NodeJS.Timeout>
) => {
  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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

    const initialCheckTimeout = setTimeout(() => {
      checkSession(isSubscribed);
    }, INITIAL_CHECK_DELAY);

    return () => {
      console.log('Cleaning up auth subscriptions');
      clearTimeout(authCheckTimeoutRef.current);
      clearTimeout(initialCheckTimeout);
      subscription?.unsubscribe();
    };
  }, [checkSession, handleAuthError, isSubscribed, authCheckTimeoutRef]);
};