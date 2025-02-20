
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRef } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';

export const useLogout = () => {
  const navigate = useNavigate();
  const { supabaseClient, session } = useSessionContext();
  const isLoggingOutRef = useRef(false);

  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOutRef.current) {
      console.log('Logout already in progress');
      return;
    }

    if (!session) {
      console.log('No active session found, redirecting to auth...');
      navigate('/auth', { replace: true });
      return;
    }

    isLoggingOutRef.current = true;
    console.log('Starting logout process with session:', session.user?.email);

    try {
      // Use the supabaseClient from the context instead of the imported client
      const { error } = await supabaseClient.auth.signOut();
      
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
