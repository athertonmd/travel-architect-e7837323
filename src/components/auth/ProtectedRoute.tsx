import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthChangeEvent } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthError = async () => {
      console.log('Session invalid, redirecting to login');
      // Clear any existing session data
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Error clearing session:', error);
      
      navigate('/');
      toast.error("Please sign in to continue");
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      console.log('Auth event:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        handleAuthError();
      }

      // Handle invalid session states
      if (!session) {
        console.error('Session invalid');
        handleAuthError();
      }
    });

    // Verify session on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error('Session check failed:', error);
        handleAuthError();
      }
    };
    
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, session]);

  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};