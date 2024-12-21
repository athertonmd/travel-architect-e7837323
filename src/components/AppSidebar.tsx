import { CalendarDays, Home, Plus, Upload, LogOut, Users } from "lucide-react";
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

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Create Trip", icon: Plus, url: "/trips/create" },
  { title: "Upload Trips", icon: Upload, url: "/trips/upload" },
  { title: "Manage Travellers", icon: Users, url: "/travellers" },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check error:', sessionError);
        toast.error('Error checking session');
        return;
      }

      if (!session) {
        console.log('No active session found, redirecting to home');
        navigate('/');
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error?.message?.includes('session_not_found')) {
        console.log('Session already cleared');
        navigate('/');
        return;
      }

      if (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out');
        return;
      }

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error("Error during logout");
      navigate("/");
    }
  };

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
          className="flex w-full items-center gap-2 text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}