
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useLogout = () => {
  const navigate = useNavigate();
  const isLoggingOutRef = useRef(false);

  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    isLoggingOutRef.current = true;
    console.log('Starting logout process...');

    try {
      // First, try to get the current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session?.user?.email);

      // Proceed with logout
      const { error } = await supabase.auth.signOut({
        scope: 'local'  // Only clear the current tab's session
      });
      
      if (error) {
        console.error('Error during Supabase signOut:', error);
        toast.error('Error during logout. Please try again.');
        return;
      }

      // Clear local storage and cookies after successful signout
      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      console.log('Logout successful, redirecting...');
      toast.success('Logged out successfully');
      
      // Immediate navigation after successful logout
      navigate('/auth', { replace: true });

    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error during logout. Please try again.');
    } finally {
      isLoggingOutRef.current = false;
    }
  };

  return {
    handleLogout,
    isLoggingOut: isLoggingOutRef.current
  };
};
