
import { CalendarDays, Home, Plus, LogOut, Users, Archive, Building2, Bell, Settings, FileKey, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useLogout } from "@/hooks/useLogout";

export function AppSidebar() {
  const { session } = useSessionContext();
  const { handleLogout } = useLogout();
  const location = useLocation();

  console.log('Session state in sidebar:', session?.user?.email);

  const menuItems = [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Create Trip", icon: Plus, url: "/trips/create" },
    { title: "Manage Travellers", icon: Users, url: "/travellers" },
    { title: "Sent Notifications", icon: Bell, url: "/notifications" },
    { title: "Hotel Bank", icon: Building2, url: "/hotels" },
    { title: "Archive", icon: Archive, url: "/trips/archive" }
  ];

  const settingsSubItems = [
    { title: "Sabre Credentials", url: "/settings/sabre" },
    { title: "Travelport Credentials", url: "/settings/travelport" },
    { title: "PDF Design", url: "/settings/pdf-design" },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    data-active={location.pathname === item.url}
                  >
                    <Link 
                      to={item.url} 
                      className="flex items-center gap-2 text-white w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  data-active={location.pathname.startsWith("/settings")}
                >
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 text-white w-full"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {settingsSubItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === subItem.url}
                      >
                        <Link to={subItem.url} className="text-white">
                          {subItem.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive hover:text-destructive/90 w-full"
                >
                  <button className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
