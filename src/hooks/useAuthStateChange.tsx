import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const INITIAL_CHECK_DELAY = 1000;
let isListenerSetup = false;

export const useAuthStateChange = (
  isSubscribed: boolean,
  checkSession: (isSubscribed: boolean) => Promise<void>,
  handleAuthError: (isSubscribed: boolean) => Promise<void>,
  authCheckTimeoutRef: React.RefObject<NodeJS.Timeout>
) => {
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const lastEventRef = useRef<string | null>(null);
  const lastEventTimeRef = useRef<number>(0);
  const isInitialCheckDoneRef = useRef(false);

  useEffect(() => {
    const debounceEvent = (event: string, callback: () => void) => {
      const now = Date.now();
      // Prevent same event from firing within 1 second
      if (lastEventRef.current === event && now - lastEventTimeRef.current < 1000) {
        console.log('Debouncing event:', event);
        return;
      }
      lastEventRef.current = event;
      lastEventTimeRef.current = now;
      callback();
    };

    const setupAuthListener = async () => {
      try {
        if (!isListenerSetup) {
          console.log('Setting up auth state change listener');
          isListenerSetup = true;

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isSubscribed) return;

            debounceEvent(event, () => {
              console.log('Auth event:', event, session ? 'Session exists' : 'No session');
              
              // Only handle specific events to reduce rerenders
              if (event === 'SIGNED_OUT') {
                clearTimeout(authCheckTimeoutRef.current);
                handleAuthError(isSubscribed).catch(console.error);
              }
            });
          });

          subscriptionRef.current = subscription;
        }
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        toast.error("Error setting up authentication. Please refresh the page.");
      }
    };

    setupAuthListener();

    // Initial session check with delay
    if (!isInitialCheckDoneRef.current) {
      const initialCheckTimeout = setTimeout(() => {
        if (isSubscribed) {
          isInitialCheckDoneRef.current = true;
          checkSession(isSubscribed).catch(error => {
            console.error('Initial session check failed:', error);
            toast.error("Failed to check session. Please refresh the page.");
          });
        }
      }, INITIAL_CHECK_DELAY);

      return () => clearTimeout(initialCheckTimeout);
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up auth subscriptions');
      clearTimeout(authCheckTimeoutRef.current);
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        isListenerSetup = false;
      }
    };
  }, [checkSession, handleAuthError, isSubscribed, authCheckTimeoutRef]);
};