import { CalendarDays, Home, Plus, Upload, LogOut, Users, Archive } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback } from "react";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Create Trip", icon: Plus, url: "/trips/create" },
  { title: "Upload Trips", icon: Upload, url: "/trips/upload" },
  { title: "Manage Travellers", icon: Users, url: "/travellers" },
  { title: "Archive", icon: Archive, url: "/trips/archive" },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      // Disable the logout button to prevent multiple clicks
      const logoutButton = document.querySelector('[data-logout-button]');
      if (logoutButton) {
        (logoutButton as HTMLButtonElement).disabled = true;
      }

      // Show loading state
      toast.loading('Logging out...');

      // Perform the logout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out');
        return;
      }

      // Clear any cached data or state if needed
      console.log('User logged out successfully');
      
      // Navigate after successful logout
      navigate("/", { replace: true });
      toast.success('Logged out successfully');
      
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('Error during logout');
    } finally {
      // Re-enable the logout button
      const logoutButton = document.querySelector('[data-logout-button]');
      if (logoutButton) {
        (logoutButton as HTMLButtonElement).disabled = false;
      }
      toast.dismiss();
    }
  }, [navigate]);

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
          data-logout-button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}