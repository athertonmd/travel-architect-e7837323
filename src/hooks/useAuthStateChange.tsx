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
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const debounceEvent = (event: string, callback: () => void) => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
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
        if (!isListenerSetup && isMountedRef.current) {
          console.log('Setting up auth state change listener');
          isListenerSetup = true;

          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isSubscribed || !isMountedRef.current) return;

            debounceEvent(event, () => {
              console.log('Auth event:', event, session ? 'Session exists' : 'No session');
              
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
        if (isMountedRef.current) {
          toast.error("Error setting up authentication. Please refresh the page.");
        }
      }
    };

    setupAuthListener();

    if (!isInitialCheckDoneRef.current && isMountedRef.current) {
      const initialCheckTimeout = setTimeout(() => {
        if (isSubscribed && isMountedRef.current) {
          isInitialCheckDoneRef.current = true;
          checkSession(isSubscribed).catch(error => {
            console.error('Initial session check failed:', error);
            if (isMountedRef.current) {
              toast.error("Failed to check session. Please refresh the page.");
            }
          });
        }
      }, INITIAL_CHECK_DELAY);

      return () => clearTimeout(initialCheckTimeout);
    }

    return () => {
      console.log('Cleaning up auth subscriptions');
      isMountedRef.current = false;
      clearTimeout(authCheckTimeoutRef.current);
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        isListenerSetup = false;
      }
    };
  }, [isSubscribed, checkSession, handleAuthError, authCheckTimeoutRef]); // Only depend on required props
};