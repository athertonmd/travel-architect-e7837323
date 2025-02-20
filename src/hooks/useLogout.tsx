
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Starting logout process...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during logout:", error.message);
        toast.error("Error during logout. Please try again.");
        return;
      }
      
      console.log("Successfully logged out!");
      toast.success("Successfully logged out!");
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
