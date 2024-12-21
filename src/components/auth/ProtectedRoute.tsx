import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ProtectedContent } from './ProtectedContent';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { useAuthStateChange } from '@/hooks/useAuthStateChange';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { checkSession, handleAuthError, authCheckTimeoutRef } = useSessionCheck(navigate);
  
  // Use ref to track component mounted state
  const isSubscribed = useRef(true);
  
  useAuthStateChange(
    isSubscribed.current,
    checkSession,
    handleAuthError,
    authCheckTimeoutRef
  );

  return <ProtectedContent>{children}</ProtectedContent>;
};