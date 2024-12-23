import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const INITIAL_CHECK_DELAY = 1000; // Increased for better stability

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
  const lastEventRef = useRef<string | null>(null);
  const lastEventTimeRef = useRef<number>(0);

  useEffect(() => {
    // Debounce function to prevent rapid event firing
    const debounceEvent = (event: string, callback: () => void) => {
      const now = Date.now();
      if (lastEventRef.current === event && now - lastEventTimeRef.current < 1000) {
        return; // Skip if same event fired within last second
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
              
              if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
                checkSession(isSubscribed).catch(error => {
                  console.error('Session check failed:', error);
                  toast.error("Session check failed. Please try again.");
                });
              }
              
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
    const initialCheckTimeout = setTimeout(() => {
      if (isSubscribed) {
        checkSession(isSubscribed).catch(error => {
          console.error('Initial session check failed:', error);
          toast.error("Failed to check session. Please refresh the page.");
        });
      }
    }, INITIAL_CHECK_DELAY);

    // Cleanup function
    return () => {
      console.log('Cleaning up auth subscriptions');
      clearTimeout(authCheckTimeoutRef.current);
      clearTimeout(initialCheckTimeout);
      
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        isListenerSetup = false;
      }
    };
  }, [checkSession, handleAuthError, isSubscribed, authCheckTimeoutRef]);
};