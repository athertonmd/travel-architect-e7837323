
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardHeader() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    getCurrentSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCreateTrip = () => {
    navigate('/trips/create');
  };

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
      <Button 
        className="bg-navy hover:bg-navy-light border border-white"
        onClick={handleCreateTrip}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Trip
      </Button>
    </div>
  );
}
