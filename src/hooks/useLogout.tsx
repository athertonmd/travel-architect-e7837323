import { useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const LOGOUT_TIMEOUT = 5000; // 5 seconds timeout

export const useLogout = () => {
  const isLoggingOutRef = useRef(false);
  const session = useSession();
  const navigate = useNavigate();

  const logoutWithTimeout = async () => {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Logout timed out')), LOGOUT_TIMEOUT)
    );
    return Promise.race([supabase.auth.signOut(), timeout]);
  };

  const handleLogout = useCallback(async () => {
    console.log('Logout initiated:', { hasSession: !!session, isLoggingOut: isLoggingOutRef.current });
    
    if (!session) {
      console.warn('No active session. Redirecting to login.');
      navigate('/', { replace: true });
      return;
    }

    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    
    // Show loading toast
    toast.loading('Logging out...', {
      duration: Infinity, // Keep showing until we dismiss it
    });

    try {
      // Use the timeout-wrapped logout function
      const { error } = await logoutWithTimeout();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }

      console.log('Logout successful');
      // Dismiss all toasts and show success
      toast.dismiss();
      toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Dismiss all toasts and show error
      toast.dismiss();
      if (error instanceof Error && error.message === 'Logout timed out') {
        toast.error('Logout timed out. Please try again.');
      } else {
        toast.error('Error during logout');
      }
      
    } finally {
      isLoggingOutRef.current = false;
      console.log('Redirecting to login page');
      navigate('/', { replace: true });
    }
  }, [navigate, session]);

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};