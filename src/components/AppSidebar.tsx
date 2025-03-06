
import { NavLink } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import { Archive, FileText, Layout, LogOut, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { logout, isPending } = useLogout();

  return (
    <Sidebar className="border-r border-navy-light bg-navy">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <img src="/lovable-uploads/3d5d9396-0e98-4c13-a4da-15a0d219e9d6.png" alt="Trip Builder" className="h-8" />
        </div>
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
          <Layout className="h-5 w-5" />
          <span>Hotels</span>
        </NavLink>
        
        <NavLink 
          to="/travellers" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Users className="h-5 w-5" />
          <span>Travellers</span>
        </NavLink>
        
        <NavLink 
          to="/archive" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <Archive className="h-5 w-5" />
          <span>Archive</span>
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
          to="/settings/pdf-design" 
          className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 hover:bg-navy-light transition-colors ${isActive ? 'bg-navy-light text-white' : 'text-gray-300'}`}
        >
          <FileText className="h-5 w-5" />
          <span>PDF Design</span>
        </NavLink>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={logout} disabled={isPending}>
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
