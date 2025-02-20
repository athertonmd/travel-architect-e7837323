
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function Layout({ children }: { children: React.ReactNode }) {
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
