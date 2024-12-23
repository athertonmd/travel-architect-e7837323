import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { ProtectedContent } from './ProtectedContent';
import { useSessionCheck } from '@/hooks/useSessionCheck';
import { useAuthStateChange } from '@/hooks/useAuthStateChange';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { checkSession, handleAuthError, authCheckTimeoutRef } = useSessionCheck(navigate);
  
  // Use ref to track component mounted state
  const isSubscribed = useRef(true);
  
  useEffect(() => {
    // Set up error boundary
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by error boundary:', event.error);
      toast.error("An error occurred. Please refresh the page.");
    };

    window.addEventListener('error', handleError);
    
    return () => {
      isSubscribed.current = false;
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  useAuthStateChange(
    isSubscribed.current,
    checkSession,
    handleAuthError,
    authCheckTimeoutRef
  );

  return <ProtectedContent>{children}</ProtectedContent>;
};