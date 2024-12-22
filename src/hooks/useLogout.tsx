import { useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const logoutTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup function to clear timeout
  const cleanup = () => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    setIsLoggingOut(false);
  };

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      console.log('Already logging out, preventing duplicate attempts');
      return;
    }

    // Set a timeout to force cleanup after 5 seconds
    logoutTimeoutRef.current = setTimeout(() => {
      console.warn('Logout timeout reached, forcing cleanup');
      cleanup();
      navigate('/');
      toast.error('Logout timed out, please try again');
    }, 5000);

    const toastId = toast.loading('Logging out...');
    console.log('Starting logout process...');
    
    try {
      setIsLoggingOut(true);

      // First validate the current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check result:', { currentSession, sessionError });

      if (sessionError) {
        console.error('Session validation error:', sessionError);
        await supabase.auth.setSession(null);
        toast.success('Session cleared', { id: toastId });
        navigate('/');
        return;
      }

      // Attempt to sign out with a timeout
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signout timeout')), 3000)
      );

      const { error } = await Promise.race([signOutPromise, timeoutPromise])
        .catch(error => ({ error }));

      console.log('Signout attempt result:', { error });
      
      if (error) {
        console.error('Logout error:', error);
        // Force clear session on any error
        await supabase.auth.setSession(null);
        toast.error('Error during logout, session cleared', { id: toastId });
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully', { id: toastId });
      }
    } catch (error) {
      console.error('Critical error during logout:', error);
      // Force clear session on critical errors
      try {
        await supabase.auth.setSession(null);
        console.log('Session forcefully cleared after error');
      } catch (clearError) {
        console.error('Failed to clear session:', clearError);
      }
      toast.error('Unexpected error during logout', { id: toastId });
    } finally {
      cleanup();
      console.log('Logout process completed, redirecting to home');
      navigate('/');
    }
  }, [isLoggingOut, navigate, session]);

  // Cleanup on unmount
  React.useEffect(() => {
    return cleanup;
  }, []);

  return {
    handleLogout,
    isLoggingOut
  };
};