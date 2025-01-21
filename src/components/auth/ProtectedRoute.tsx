import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    console.log('Auth state change in ProtectedRoute:', 'INITIAL_SESSION', !!session);
    console.log('Session check in ProtectedRoute:', !!session);
  }, [session]);

  if (!session) {
    console.log('No session, redirecting to auth');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};