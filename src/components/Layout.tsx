
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLocation, Navigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const session = useSession();
  const isAuthPage = location.pathname === "/auth";

  console.log('Layout render - session:', session ? 'exists' : 'none', 'path:', location.pathname);

  // If not on auth page and no session, redirect to auth
  if (!isAuthPage && !session) {
    return <Navigate to="/auth" replace />;
  }

  // On auth page with session, redirect to dashboard
  if (isAuthPage && session) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col sm:flex-row w-full bg-navy">
        <AppSidebar />
        <main className="flex-1 p-4 sm:p-8 bg-navy text-white overflow-x-hidden">
          <div className="container mx-auto">
            <div className="mb-4 sm:mb-0">
              <SidebarTrigger />
            </div>
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
