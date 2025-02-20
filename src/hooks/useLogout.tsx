
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session state:", session ? "Active" : "No session");
      
      // Always try to sign out, even if session check fails
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Only clear current browser tab session
      });
      
      if (error && error.message !== 'Auth session missing!') {
        // Only show error if it's not the "session missing" error
        console.error("Error during logout:", error.message);
        toast.error("Error during logout. Please try again.");
        return;
      }
      
      // Consider logout successful even if session was already missing
      console.log("Successfully logged out!");
      toast.success("Successfully logged out!");
      
      // Force a clean navigation to auth page
      navigate('/auth', { replace: true });
      
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  return {
    handleLogout
  };
};
