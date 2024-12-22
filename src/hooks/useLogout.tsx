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

    // Always navigate first to prevent UI issues
    navigate('/', { replace: true });

    isLoggingOutRef.current = true;
    
    try {
      // Show loading toast
      toast.loading('Signing out...', {
        duration: 2000 // Auto dismiss after 2 seconds
      });
      
      console.log('Starting logout process');

      // If there's no session, just clean up the UI
      if (!session) {
        console.warn('No active session found');
        toast.success('Signed out successfully', {
          duration: 3000
        });
        return;
      }

      const signOutPromise = supabase.auth.signOut({ scope: 'local' });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timed out')), LOGOUT_TIMEOUT)
      );
      
      // Wait for signOut in background
      await Promise.race([signOutPromise, timeoutPromise]);
      console.log('Logout successful');
      
      toast.success('Logged out successfully', {
        duration: 3000
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, we want to clear local state
      await supabase.auth.signOut({ scope: 'local' });
      toast.error('Error during logout, but local session cleared');
      
    } finally {
      isLoggingOutRef.current = false;
    }
  }, [navigate, session]);

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};