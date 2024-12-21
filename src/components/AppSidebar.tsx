import { CalendarDays, Home, Plus, Upload, LogOut, Users, Archive } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback, useState } from "react";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Create Trip", icon: Plus, url: "/trips/create" },
  { title: "Upload Trips", icon: Upload, url: "/trips/upload" },
  { title: "Manage Travellers", icon: Users, url: "/travellers" },
  { title: "Archive", icon: Archive, url: "/trips/archive" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts

    try {
      setIsLoggingOut(true);
      const toastId = toast.loading('Logging out...');

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out', { id: toastId });
        return;
      }

      // Only navigate after successful logout
      toast.success('Logged out successfully', { id: toastId });
      navigate("/", { replace: true });
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error during logout');
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate, isLoggingOut]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2 text-white">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4">
        <SidebarMenuButton
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-2 text-destructive hover:text-destructive disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}