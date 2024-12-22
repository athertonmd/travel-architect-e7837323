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
    
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    if (!session) {
      console.warn('No active session. Redirecting to login.');
      navigate('/', { replace: true });
      return;
    }

    isLoggingOutRef.current = true;
    
    try {
      // Show loading toast
      toast.loading('Signing out...', {
        duration: 2000
      });
      
      console.log('Starting logout process');
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      console.log('Logout successful');
      toast.success('Logged out successfully');
      
      // Navigate after successful logout
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
      
      // Even if there's an error, redirect to login page for safety
      navigate('/', { replace: true });
      
    } finally {
      isLoggingOutRef.current = false;
    }
  }, [navigate, session]);

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};