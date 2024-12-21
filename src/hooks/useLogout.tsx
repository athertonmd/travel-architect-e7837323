import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from '@supabase/auth-helpers-react';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const session = useSession();

  const handleLogout = useCallback(async () => {
    // Prevent multiple logout attempts
    if (isLoggingOut || !session) return;

    const toastId = toast.loading('Logging out...');
    
    try {
      setIsLoggingOut(true);
      console.log('Starting logout process...');
      
      // Force clear the session locally first
      await supabase.auth.setSession(null);
      
      // Attempt to sign out to clean up any lingering state
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout', { id: toastId });
        return;
      }
      
      console.log('Logout successful');
      toast.success('Logged out successfully', { id: toastId });
      
      // Force navigation to login page using window.location for a clean state
      window.location.href = '/';
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error during logout', { id: toastId });
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, session]);

  return {
    handleLogout,
    isLoggingOut
  };
};