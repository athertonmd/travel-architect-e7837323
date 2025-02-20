
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Session } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  session: Session;
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const userEmail = session?.user?.email;

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Travel Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-white mt-1">Manage your travel itineraries</p>
          {userEmail && (
            <p className="text-white/70 mt-1">• Logged in as {userEmail}</p>
          )}
        </div>
      </div>
      <Link to="/trips/create">
        <Button 
          className="bg-navy hover:bg-navy-light border border-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Trip
        </Button>
      </Link>
    </div>
  );
}
