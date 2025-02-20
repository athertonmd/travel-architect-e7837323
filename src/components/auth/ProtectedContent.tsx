
import { useSession } from '@supabase/auth-helpers-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSkeleton } from '../LoadingSkeleton';

export function ProtectedContent() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          setIsAuthenticated(false);
          return;
        }

        console.log('Session check result:', session ? 'Session found' : 'No session');
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <LoadingSkeleton />
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
