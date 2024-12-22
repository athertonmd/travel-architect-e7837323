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
    if (isLoggingOut || !session) {
      console.log('Logout prevented:', { isLoggingOut, hasSession: !!session });
      navigate('/');
      return;
    }

    const toastId = toast.loading('Logging out...');
    setIsLoggingOut(true);

    try {
      // Clear any stored auth state first
      localStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully', { id: toastId });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout', { id: toastId });
    } finally {
      setIsLoggingOut(false);
    }
  }, [session, isLoggingOut, navigate]);

  return {
    handleLogout,
    isLoggingOut
  };
};