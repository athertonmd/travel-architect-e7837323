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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        if (error.message?.includes('session_not_found')) {
          console.warn('Session not found, redirecting to login');
          toast.success('Logged out successfully', { id: toastId });
        } else {
          toast.error('Error during logout', { id: toastId });
        }
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully', { id: toastId });
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Unexpected error during logout', { id: toastId });
    } finally {
      setIsLoggingOut(false);
      navigate('/');
    }
  }, [isLoggingOut, navigate]);

  return {
    handleLogout,
    isLoggingOut
  };
};