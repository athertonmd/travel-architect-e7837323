import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const logoutTimeoutRef = useRef<NodeJS.Timeout>();
  const isLoggingOutRef = useRef(false);

  const cleanup = useCallback(() => {
    console.log('Running cleanup...');
    if (logoutTimeoutRef.current) {
      console.log('Clearing timeout...');
      clearTimeout(logoutTimeoutRef.current);
    }
    console.log('Resetting logout states...');
    setIsLoggingOut(false);
    isLoggingOutRef.current = false;
  }, []);

  const handleLogout = useCallback(async () => {
    console.log('Logout initiated...', { 
      isLoggingOutRef: isLoggingOutRef.current,
      hasSession: !!session,
      sessionDetails: session ? 'Session exists' : 'No session'
    });

    if (isLoggingOutRef.current) {
      console.log('Preventing duplicate logout attempt');
      return;
    }

    if (!session) {
      console.warn('No active session found during logout');
      navigate('/');
      return;
    }

    isLoggingOutRef.current = true;
    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      console.log('Setting up logout timeout...');
      const timeoutPromise = new Promise<void>((_, reject) => {
        logoutTimeoutRef.current = setTimeout(() => {
          console.log('Logout timeout triggered');
          reject(new Error('Logout timed out'));
        }, 3000);
      });

      console.log('Attempting Supabase signOut...');
      // First attempt server-side signOut
      await Promise.race([
        supabase.auth.signOut().then(() => {
          console.log('Server-side signOut completed');
        }),
        timeoutPromise
      ]);

      console.log('Logout successful');
      toast.success('Logged out successfully', { id: toastId });
    } catch (error: any) {
      console.error('Logout error details:', {
        errorMessage: error?.message,
        errorName: error?.name,
        errorStack: error?.stack,
        errorType: typeof error
      });

      if (error.message === 'Logout timed out') {
        console.warn('Logout request timed out, proceeding with local cleanup');
        toast.error('Logout timed out. Local session cleared.', { id: toastId });
      } else {
        console.error('Unexpected logout error:', error);
        toast.error('Error during logout. Local session cleared.', { id: toastId });
      }
    } finally {
      console.log('Entering finally block...');
      cleanup();
      console.log('Navigating to home...');
      // Add a small delay before navigation to ensure cleanup completes
      setTimeout(() => {
        navigate('/');
        console.log('Navigation completed');
      }, 100);
    }
  }, [session, navigate, cleanup]);

  useEffect(() => {
    return () => {
      console.log('Component unmounting, running cleanup...');
      cleanup();
    };
  }, [cleanup]);

  return {
    handleLogout,
    isLoggingOut
  };
};