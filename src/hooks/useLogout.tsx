import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      console.log('Already logging out, preventing duplicate attempts');
      return;
    }

    const toastId = toast.loading('Logging out...');
    console.log('Starting logout process...');
    console.log('Current session state:', session);
    
    try {
      setIsLoggingOut(true);

      // First validate the current session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check result:', { currentSession, sessionError });

      if (sessionError) {
        console.error('Session validation error:', sessionError);
        // Force clear the session if validation fails
        await supabase.auth.setSession(null);
        toast.success('Session cleared', { id: toastId });
        navigate('/');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      console.log('Signout attempt result:', { error });
      
      if (error) {
        console.error('Logout error:', error);
        if (error.message?.includes('session_not_found')) {
          console.warn('Session not found, clearing local state');
          await supabase.auth.setSession(null);
          toast.success('Logged out successfully', { id: toastId });
        } else {
          console.error('Unexpected logout error:', error);
          // Force clear session on unexpected errors
          await supabase.auth.setSession(null);
          toast.error('Error during logout, session cleared', { id: toastId });
        }
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully', { id: toastId });
      }
    } catch (error) {
      console.error('Critical error during logout:', error);
      // Attempt to clear session even on critical errors
      try {
        await supabase.auth.setSession(null);
        console.log('Session forcefully cleared after error');
      } catch (clearError) {
        console.error('Failed to clear session:', clearError);
      }
      toast.error('Unexpected error during logout', { id: toastId });
    } finally {
      setIsLoggingOut(false);
      console.log('Logout process completed, redirecting to home');
      navigate('/');
    }
  }, [isLoggingOut, navigate, session]);

  return {
    handleLogout,
    isLoggingOut
  };
};