import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

const INITIAL_CHECK_DELAY = 100;

// Singleton to track if listener is already set up
let isListenerSetup = false;

export const useAuthStateChange = (
  isSubscribed: boolean,
  checkSession: (isSubscribed: boolean) => Promise<void>,
  handleAuthError: (isSubscribed: boolean) => Promise<void>,
  authCheckTimeoutRef: React.RefObject<NodeJS.Timeout>
) => {
  // Keep track of the subscription
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    // Only set up the listener if it hasn't been set up yet
    if (!isListenerSetup) {
      console.log('Setting up auth state change listener');
      isListenerSetup = true;

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

      // Store the subscription reference
      subscriptionRef.current = subscription;
    }

    const initialCheckTimeout = setTimeout(() => {
      checkSession(isSubscribed);
    }, INITIAL_CHECK_DELAY);

    // Cleanup function
    return () => {
      console.log('Cleaning up auth subscriptions');
      clearTimeout(authCheckTimeoutRef.current);
      clearTimeout(initialCheckTimeout);
      
      // Only unsubscribe and reset the listener setup when the component is unmounting
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        isListenerSetup = false;
      }
    };
  }, [checkSession, handleAuthError, isSubscribed, authCheckTimeoutRef]);
};
