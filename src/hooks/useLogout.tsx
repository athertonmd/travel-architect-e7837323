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
    const toastId = toast.loading('Logging out...');
    
    try {
      console.log('Attempting to sign out with Supabase');
      const timeout = new Promise((_, reject) => 
        setTimeout(() => {
          console.log('Logout timeout reached');
          reject(new Error('Logout timed out'));
        }, LOGOUT_TIMEOUT)
      );

      await Promise.race([
        supabase.auth.signOut(),
        timeout
      ]);

      console.log('Logout successful');
      toast.success('Logged out successfully', { id: toastId });
      
    } catch (error) {
      console.error('Logout error:', error);
      if (error instanceof Error && error.message === 'Logout timed out') {
        console.log('Timeout error detected');
        toast.error('Logout timed out. Please try again.', { id: toastId });
      } else {
        console.log('Generic error detected');
        toast.error('Error during logout', { id: toastId });
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