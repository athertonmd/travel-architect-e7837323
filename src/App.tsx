
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import { ProtectedContent } from "@/components/auth/ProtectedContent";
import Index from "@/pages/Index";
import CreateTrip from "@/pages/CreateTrip";
import ViewTrip from "@/pages/ViewTrip";
import Archive from "@/pages/Archive";
import ManageTravellers from "@/pages/ManageTravellers";
import HotelBank from "@/pages/HotelBank";
import Notifications from "@/pages/Notifications";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

const queryClient = new QueryClient();

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Wait for initial session check
      await supabase.auth.getSession();
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider
          router={createBrowserRouter([
            {
              path: "/",
              element: <ProtectedContent />,
              children: [
                {
                  path: "/",
                  element: <Navigate to="/dashboard" />,
                },
                {
                  path: "/dashboard",
                  element: <Index />,
                },
                {
                  path: "/trips/create",
                  element: <CreateTrip />,
                },
                {
                  path: "/trips/:id",
                  element: <ViewTrip />,
                },
                {
                  path: "/trips/archive",
                  element: <Archive />,
                },
                {
                  path: "/travellers",
                  element: <ManageTravellers />,
                },
                {
                  path: "/hotels",
                  element: <HotelBank />,
                },
                {
                  path: "/notifications",
                  element: <Notifications />,
                },
              ],
            },
            {
              path: "/auth",
              element: <Auth />,
            },
          ])}
        />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
