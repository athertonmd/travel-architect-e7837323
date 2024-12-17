import { CalendarDays, Home, PlaneTakeoff, Plus, Hotel, Car, Utensils, Dumbbell, Bus, Crown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "All Trips", icon: CalendarDays, url: "/trips" },
  { title: "Create Trip", icon: Plus, url: "/trips/create" },
];

const segmentItems = [
  { title: "Flights", icon: PlaneTakeoff, url: "/segments/flights" },
  { title: "Hotels", icon: Hotel, url: "/segments/hotels" },
  { title: "Transport", icon: Car, url: "/segments/transport" },
  { title: "Dining", icon: Utensils, url: "/segments/dining" },
  { title: "Activities", icon: Dumbbell, url: "/segments/activities" },
  { title: "Transfers", icon: Bus, url: "/segments/transfers" },
  { title: "VIP Services", icon: Crown, url: "/segments/vip" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Segments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {segmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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