
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

export const useLogout = () => {
  const navigate = useNavigate();
  const session = useSession();
  const isLoggingOutRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();
  const toastIdRef = useRef<string | number>();

  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    toastIdRef.current = toast.loading('Signing out...', {
      duration: Infinity
    });

    try {
      console.log('Starting logout process...');
      
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
        toast.error('Error during logout. Please try again.');
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully');
      }

      // Force navigation regardless of logout success
      navigate('/', { replace: true });

    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error during logout. Please try again.');
      navigate('/', { replace: true });
    } finally {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      isLoggingOutRef.current = false;
    }
  };

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};
