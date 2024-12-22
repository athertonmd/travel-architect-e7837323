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

  const cleanup = useCallback(() => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    setIsLoggingOut(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      // Force clear the session locally first
      await supabase.auth.setSession(null);
      console.log('Local session cleared');

      // Set a timeout for the server-side logout
      const timeoutPromise = new Promise<void>((_, reject) => {
        logoutTimeoutRef.current = setTimeout(() => {
          reject(new Error('Logout timed out'));
        }, 3000);
      });

      // Attempt server-side logout with timeout
      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);

      toast.success('Logged out successfully', { id: toastId });
    } catch (error) {
      console.error('Logout error:', error);
      // Session is already cleared locally, so we can safely continue
      toast.error('Error during logout, but session cleared', { id: toastId });
    } finally {
      cleanup();
      // Force navigation regardless of logout success
      navigate('/');
    }
  }, [isLoggingOut, navigate, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    handleLogout,
    isLoggingOut
  };
};