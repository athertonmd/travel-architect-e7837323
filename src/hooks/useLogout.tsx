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
    console.log('Logout initiated...', { 
      isLoggingOut, 
      hasSession: !!session,
      sessionDetails: session ? 'Session exists' : 'No session'
    });

    if (isLoggingOut) {
      console.log('Preventing duplicate logout attempt');
      return;
    }

    if (!session) {
      console.warn('No active session found during logout');
      navigate('/');
      return;
    }

    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      console.log('Attempting Supabase signOut...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error('Logout failed. Please try again.', { id: toastId });
        return;
      }

      console.log('Logout successful');
      toast.success('Logged out successfully', { id: toastId });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error during logout', { id: toastId });
    } finally {
      console.log('Cleanup: Resetting logout state');
      setIsLoggingOut(false);
      
      // Small delay before navigation to ensure state updates complete
      setTimeout(() => {
        console.log('Navigating to home page');
        navigate('/');
      }, 100);
    }
  }, [session, isLoggingOut, navigate]);

  return {
    handleLogout,
    isLoggingOut
  };
};