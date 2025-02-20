
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import { useSession } from '@supabase/auth-helpers-react';
import Index from "@/pages/Index";
import CreateTrip from "@/pages/CreateTrip";
import ViewTrip from "@/pages/ViewTrip";
import Archive from "@/pages/Archive";
import ManageTravellers from "@/pages/ManageTravellers";
import HotelBank from "@/pages/HotelBank";
import Notifications from "@/pages/Notifications";

const queryClient = new QueryClient();

function ProtectedContent() {
  const session = useSession();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

export default function App() {
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
