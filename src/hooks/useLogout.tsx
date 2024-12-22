import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

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
      duration: Infinity
    });

    try {
      // If no session exists, just navigate away
      if (!session) {
        console.log('No active session found, proceeding with navigation');
        toast.dismiss(loadingToast);
        navigate('/', { replace: true });
        return;
      }

      // Clear local storage and cookies
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during Supabase signOut:', error);
        toast.dismiss(loadingToast);
        toast.error('Error during logout. Please try again.');
      } else {
        console.log('Logout successful');
        toast.dismiss(loadingToast);
        toast.success('Logged out successfully');
      }

      // Always navigate after cleanup
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Unexpected logout error:', error);
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