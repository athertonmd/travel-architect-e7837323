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
    console.log('Logout initiated:', { hasSession: !!session, isLoggingOut });
    
    // Prevent multiple logout attempts
    if (isLoggingOut) {
      console.log('Logout already in progress');
      return;
    }

    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      // Always clear local storage first
      localStorage.removeItem('supabase.auth.token');
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }

      console.log('Logout successful');
      toast.success('Logged out successfully', { id: toastId });
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout', { id: toastId });
      
    } finally {
      setIsLoggingOut(false);
      // Always redirect to login page, regardless of errors
      console.log('Redirecting to login page');
      navigate('/', { replace: true });
    }
  }, [navigate, isLoggingOut]);

  return {
    handleLogout,
    isLoggingOut
  };
};