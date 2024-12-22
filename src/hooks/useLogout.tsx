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
    
    try {
      console.log('Starting logout process');
      
      // Start the signOut process
      const signOutPromise = supabase.auth.signOut();
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Logout timed out')), LOGOUT_TIMEOUT);
      });

      // Show loading toast immediately
      toast.loading('Signing out...', { duration: 2000 });
      
      // Navigate immediately to prevent blank screen
      console.log('Navigating to login page');
      navigate('/', { replace: true });
      
      // Wait for signOut in background
      const result = await Promise.race([signOutPromise, timeoutPromise]);
      console.log('Logout completed:', result);
      
      toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please refresh the page.');
      
    } finally {
      isLoggingOutRef.current = false;
    }
  }, [navigate, session]);

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};