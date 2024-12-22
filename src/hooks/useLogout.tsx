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
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    setIsLoggingOut(false);
    isLoggingOutRef.current = false;
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOutRef.current) return;

    if (!session) {
      console.warn('No active session. Redirecting to home.');
      navigate('/');
      return;
    }

    isLoggingOutRef.current = true;
    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      const timeoutPromise = new Promise<void>((_, reject) => {
        logoutTimeoutRef.current = setTimeout(() => {
          reject(new Error('Logout timed out'));
        }, 5000); // 5 second timeout
      });

      // Attempt Supabase signOut with timeout
      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);

      toast.success('Logged out successfully', { id: toastId });
    } catch (error: any) {
      if (error.message === 'Logout timed out') {
        console.error('Logout request timed out. Proceeding with local cleanup.');
        toast.error('Logout timed out. Local session cleared.', { id: toastId });
      } else {
        console.error('Unexpected logout error:', error);
        toast.error('Error during logout. Local session cleared.', { id: toastId });
      }
      
      // Force clear the session locally in case of any error
      await supabase.auth.setSession(null);
    } finally {
      cleanup();
      navigate('/');
    }
  }, [session, navigate, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    handleLogout,
    isLoggingOut
  };
};