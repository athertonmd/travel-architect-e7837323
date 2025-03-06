
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

export const useLogout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      console.log("Starting logout process...");
      
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session state:", session ? "Active" : "No session");
      
      // Try both global and local signout
      await supabase.auth.signOut({ scope: 'global' });
      await supabase.auth.signOut({ scope: 'local' });
      
      // Force clear the Supabase session from localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.expires_at');
      
      // Clear all browser storage to be thorough
      localStorage.clear();
      sessionStorage.clear();
      
      console.log("Successfully logged out!");
      toast.success("Successfully logged out!");
      
      // Only use navigate, remove window.location.reload()
      navigate('/auth', { replace: true });
      
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      toast.error("An unexpected error occurred during logout.");
      // Even if there's an error, try to redirect to auth
      navigate('/auth', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogout,
    isLoading
  };
};
