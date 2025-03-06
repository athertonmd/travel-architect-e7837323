
import { NavLink } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import { Archive, Bell, FileText, Hotel, Layout, LogOut, Plus, Send, Settings, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const { handleLogout, isLoading } = useLogout();

  return (
    <Sidebar className="border-r border-navy-light bg-navy">
      <SidebarHeader className="p-4">
        <Link to="/trips/create">
          <Button 
            className="w-full bg-navy hover:bg-navy-light border border-white text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Button>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col gap-2 p-4">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Layout className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/hotels" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Hotel className="h-5 w-5" />
          <span>Hotel Bank</span>
        </NavLink>
        
        <NavLink 
          to="/travellers" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Users className="h-5 w-5" />
          <span>Manage Travellers</span>
        </NavLink>
        
        <NavLink 
          to="/archive" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Archive className="h-5 w-5" />
          <span>Archive</span>
        </NavLink>

        <NavLink 
          to="/notifications" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </NavLink>
        
        <NavLink 
          to="/sent-notifications" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Send className="h-5 w-5" />
          <span>Sent Notifications</span>
        </NavLink>
        
        <h3 className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase">Settings</h3>
        
        <NavLink 
          to="/settings/sabre" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Settings className="h-5 w-5" />
          <span>Sabre Credentials</span>
        </NavLink>
        
        <NavLink 
          to="/settings/travelport" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Settings className="h-5 w-5" />
          <span>Travelport Credentials</span>
        </NavLink>
        
        <NavLink 
          to="/settings/pdf-design" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <FileText className="h-5 w-5" />
          <span>PDF Design</span>
        </NavLink>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="destructive" 
          className="w-full justify-start font-medium text-white hover:bg-red-600"
          onClick={handleLogout} 
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-5 w-5" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
