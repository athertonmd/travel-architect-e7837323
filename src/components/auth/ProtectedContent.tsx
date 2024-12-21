import { useSession } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

interface ProtectedContentProps {
  children: React.ReactNode;
}

export const ProtectedContent = ({ children }: ProtectedContentProps) => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};