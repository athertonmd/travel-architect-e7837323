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
    
    try {
      setIsLoggingOut(true);

      // First check if we have a session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        console.log('No active session found, redirecting to login');
        toast.success('Logged out successfully', { id: toastId });
        navigate('/');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Even if there's an error, we'll clear the local session
        await supabase.auth.setSession(null);
        toast.error('Error during logout, but session cleared', { id: toastId });
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully', { id: toastId });
      }

      // Always redirect to login page
      navigate('/');
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      // Attempt to clear session even if there's an error
      try {
        await supabase.auth.setSession(null);
      } catch (clearError) {
        console.error('Error clearing session:', clearError);
      }
      toast.error('Error during logout', { id: toastId });
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, navigate]);

  return {
    handleLogout,
    isLoggingOut
  };
};