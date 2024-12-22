import { useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const isLoggingOutRef = useRef(false);
  const session = useSession();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    console.log('Logout initiated:', { hasSession: !!session, isLoggingOut: isLoggingOutRef.current });
    
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    const toastId = toast.loading('Logging out...');

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
      isLoggingOutRef.current = false;
      // Always redirect to login page, regardless of errors
      console.log('Redirecting to login page');
      navigate('/', { replace: true });
    }
  }, [navigate, session]);

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};