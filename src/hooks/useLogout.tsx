import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

const LOGOUT_TIMEOUT = 5000; // 5 seconds timeout

export const useLogout = () => {
  const navigate = useNavigate();
  const session = useSession();
  const isLoggingOutRef = useRef(false);

  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    
    const loadingToast = toast.loading('Signing out...', {
      duration: Infinity // Don't auto dismiss while processing
    });

    try {
      console.log('Starting logout process');
      
      if (!session) {
        console.log('No active session found, proceeding with navigation');
        navigate('/', { replace: true });
        return;
      }

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Logout timed out')), LOGOUT_TIMEOUT);
      });

      // Race between logout and timeout
      const { error } = await Promise.race([
        supabase.auth.signOut({ scope: 'local' }), // Only clear local session
        timeoutPromise
      ]) as { error: Error | null };

      if (error) {
        console.error('Logout error:', error);
        // If we get a session not found error, just proceed with navigation
        if (error.message?.includes('session_not_found')) {
          console.log('Session not found, proceeding with navigation');
          navigate('/', { replace: true });
          return;
        }
        throw error;
      }

      console.log('Logout successful');
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
      
      // Navigate after successful logout
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Logout error:', error);
      toast.dismiss(loadingToast);
      toast.error('Error during logout. Please try again.');
      
      // Force navigation on error after a short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

    } finally {
      isLoggingOutRef.current = false;
    }
  };

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};