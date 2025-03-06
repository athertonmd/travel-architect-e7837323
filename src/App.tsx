
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import CreateTrip from "@/pages/CreateTrip";
import ViewTrip from "@/pages/ViewTrip";
import Archive from "@/pages/Archive";
import ManageTravellers from "@/pages/ManageTravellers";
import HotelBank from "@/pages/HotelBank";
import Notifications from "@/pages/Notifications";
import SentNotifications from "@/pages/SentNotifications";
import SabreCredentials from "@/pages/SabreCredentials";
import PdfDesignSettings from "@/pages/PdfDesignSettings";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Session } from '@supabase/supabase-js';
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session loaded:', initialSession?.user?.email);
        setSession(initialSession);
      } catch (error) {
        console.error('Error getting initial session:', error);
        toast.error('Error initializing session');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed, new session:', session?.user?.email);
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <LoadingSkeleton />
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: session ? <Navigate to="/dashboard" replace /> : <Auth />,
    },
    {
      path: "/",
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: "/dashboard",
      element: session ? <Index /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/trips/create",
      element: session ? <CreateTrip /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/trips/archive",
      element: session ? <Archive /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/trips/:id",
      element: session ? <ViewTrip /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/travellers",
      element: session ? <ManageTravellers /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/hotels",
      element: session ? <HotelBank /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/notifications",
      element: session ? <Notifications /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/sent-notifications",
      element: session ? <SentNotifications /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/settings/sabre",
      element: session ? <SabreCredentials /> : <Navigate to="/auth" replace />,
    },
    {
      path: "/settings/pdf-design",
      element: session ? <PdfDesignSettings /> : <Navigate to="/auth" replace />,
    },
    // Add a redirect for the old route
    {
      path: "/archive",
      element: <Navigate to="/trips/archive" replace />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase} initialSession={session}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}
