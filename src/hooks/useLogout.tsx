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
      // Show loading toast - Sonner doesn't use IDs for toast management
      toast.loading('Signing out...', {
        duration: 2000 // Auto dismiss after 2 seconds
      });
      
      console.log('Starting logout process');
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timed out')), LOGOUT_TIMEOUT)
      );

      // Navigate first to prevent blank screen
      navigate('/', { replace: true });
      
      // Wait for signOut in background
      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('Logout successful');
      
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