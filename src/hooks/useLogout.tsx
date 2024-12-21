import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      console.log('Already logging out, preventing duplicate attempts');
      return;
    }

    const toastId = toast.loading('Logging out...');
    console.log('Starting logout process...');
    
    try {
      setIsLoggingOut(true);

      // First check if we have a session
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        // If we can't get the session, it's likely expired/invalid
        await supabase.auth.setSession(null);
        toast.success('Session cleared', { id: toastId });
        navigate('/');
        return;
      }

      if (!currentSession) {
        console.log('No active session found, redirecting to login');
        toast.success('Logged out successfully', { id: toastId });
        navigate('/');
        return;
      }

      // Check if token is expired
      const tokenExpiryTime = new Date(currentSession.expires_at * 1000);
      const isTokenExpired = tokenExpiryTime <= new Date();

      if (isTokenExpired) {
        console.log('Token expired, clearing session');
        await supabase.auth.setSession(null);
        toast.success('Session expired, logged out successfully', { id: toastId });
        navigate('/');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        // Handle specific error cases
        if (error.message?.includes('token') || error.message?.includes('JWT')) {
          console.log('Token invalid, clearing session');
          await supabase.auth.setSession(null);
          toast.success('Session cleared successfully', { id: toastId });
        } else {
          // Even if there's an error, we'll clear the local session
          await supabase.auth.setSession(null);
          toast.error('Error during logout, but session cleared', { id: toastId });
        }
      } else {
        console.log('Logout successful');
        toast.success('Logged out successfully', { id: toastId });
      }

      // Always redirect to login page
      navigate('/');
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      // Attempt to clear session even if there's an error
      try {
        await supabase.auth.setSession(null);
      } catch (clearError) {
        console.error('Error clearing session:', clearError);
      }
      toast.error('Error during logout', { id: toastId });
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, navigate]);

  return {
    handleLogout,
    isLoggingOut
  };
};