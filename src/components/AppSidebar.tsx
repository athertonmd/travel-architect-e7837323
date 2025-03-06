
import { NavLink } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import { Archive, Bell, ChevronDown, ChevronRight, FileText, Hotel, Layout, LogOut, Plus, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AppSidebar() {
  const { handleLogout, isLoading } = useLogout();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Sidebar className="border-r border-navy-light bg-navy">
      <SidebarHeader className="p-4">
        {/* Create Trip button removed from header */}
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
          to="/trips/create" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Plus className="h-5 w-5" />
          <span>Create Trip</span>
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
          to="/trips/archive" 
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
        
        {/* Settings Menu with Collapsible Submenu */}
        <div className="mt-6">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-gray-300 hover:bg-navy-light transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </div>
            {settingsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {settingsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-navy-light pl-4">
              <NavLink 
                to="/settings/sabre" 
                className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
              >
                <span>Sabre Credentials</span>
              </NavLink>
              
              <NavLink 
                to="/settings/travelport" 
                className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
              >
                <span>Travelport Credentials</span>
              </NavLink>
              
              <NavLink 
                to="/settings/pdf-design" 
                className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
              >
                <span>PDF Design</span>
              </NavLink>
            </div>
          )}
        </div>
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
