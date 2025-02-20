
import { useSession } from '@supabase/auth-helpers-react';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedContent() {
  const session = useSession();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
