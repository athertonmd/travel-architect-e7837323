import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import Index from "./pages/Index";
import CreateTrip from "./pages/CreateTrip";
import ViewTrip from "./pages/ViewTrip";
import Auth from "./pages/Auth";
import ManageTravellers from "./pages/ManageTravellers";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted');
        handleAuthError();
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESH_FAILED') {
        console.error('Token refresh failed');
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
  }, [navigate]);

  if (!session) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/create"
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id"
              element={
                <ProtectedRoute>
                  <ViewTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/upload"
              element={
                <ProtectedRoute>
                  <div className="p-4">Upload Trips Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/travellers"
              element={
                <ProtectedRoute>
                  <ManageTravellers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;