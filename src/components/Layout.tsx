import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLocation } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/";

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