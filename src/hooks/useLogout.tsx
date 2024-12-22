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
      
      // If no session exists, just navigate away
      if (!session) {
        console.log('No active session found, proceeding with navigation');
        toast.dismiss(loadingToast);
        navigate('/', { replace: true });
        return;
      }

      // First try to clear local storage and cookies
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Remove any existing auth subscriptions
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {});
      subscription?.unsubscribe();

      try {
        // Attempt to sign out from Supabase
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error('Error during Supabase signOut:', signOutError);
        // Continue with navigation even if signOut fails
      }

      console.log('Logout successful');
      toast.dismiss(loadingToast);
      toast.success('Logged out successfully');
      
      // Always navigate after cleanup
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