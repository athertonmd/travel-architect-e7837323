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

  // Simple cleanup function
  const cleanup = useCallback(() => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    setIsLoggingOut(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return; // Prevent multiple logout attempts
    }

    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      // Set a hard timeout of 3 seconds
      const timeoutPromise = new Promise<void>((_, reject) => {
        logoutTimeoutRef.current = setTimeout(() => {
          reject(new Error('Logout timed out'));
        }, 3000);
      });

      // Try to sign out with a timeout
      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);

      // If successful, clear session and redirect
      await supabase.auth.setSession(null);
      toast.success('Logged out successfully', { id: toastId });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear session on error
      await supabase.auth.setSession(null);
      toast.error('Error during logout, session cleared', { id: toastId });
    } finally {
      cleanup();
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