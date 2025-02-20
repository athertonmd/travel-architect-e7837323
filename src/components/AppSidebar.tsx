
import { CalendarDays, Home, Plus, LogOut, Users, Archive, Building2, Bell } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { useLogout } from "@/hooks/useLogout";

export function AppSidebar() {
  const session = useSession();
  const { handleLogout } = useLogout();
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: Home, url: "/dashboard" },
    { title: "Create Trip", icon: Plus, url: "/trips/create" },
    { title: "Manage Travellers", icon: Users, url: "/travellers" },
    { title: "Sent Notifications", icon: Bell, url: "/notifications" },
    { title: "Hotel Bank", icon: Building2, url: "/hotels" },
    { title: "Archive", icon: Archive, url: "/trips/archive" },
    { 
      title: "Log Out", 
      icon: LogOut, 
      url: "#",
      onClick: handleLogout,
      className: "text-destructive hover:text-destructive/90",
      disabled: !session
    }
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
                    asChild={!item.onClick}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={item.className}
                  >
                    {item.onClick ? (
                      <button className="flex items-center gap-2 text-white w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-2 text-white w-full"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
