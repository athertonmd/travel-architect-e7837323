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
      console.log('Session invalid or expired');
      await supabase.auth.signOut();
      navigate('/');
      toast.error("Please sign in to continue");
    };

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          handleAuthError();
          return;
        }

        if (!currentSession) {
          console.log('No active session found');
          handleAuthError();
          return;
        }

        // Verify token is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User verification failed:', userError);
          handleAuthError();
        }
      } catch (error) {
        console.error('Session verification error:', error);
        handleAuthError();
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, currentSession) => {
      console.log('Auth event:', event, currentSession ? 'Session exists' : 'No session');
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted');
        handleAuthError();
      }
    });

    // Check session on mount
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Redirect if no session
  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};