
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, useSession } from '@supabase/auth-helpers-react';
import { useLogout } from "@/hooks/useLogout";

export function DashboardHeader() {
  const navigate = useNavigate();
  const session = useSession();
  const { handleLogout } = useLogout();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Travel Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-white mt-1">Manage your travel itineraries</p>
          {session?.user?.email && (
            <p className="text-white/70 mt-1">• Logged in as {session.user.email}</p>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline"
          onClick={handleLogout}
          className="bg-transparent text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
        <Button 
          className="bg-navy hover:bg-navy-light border border-white"
          onClick={() => navigate("/trips/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Trip
        </Button>
      </div>
    </div>
  );
}
