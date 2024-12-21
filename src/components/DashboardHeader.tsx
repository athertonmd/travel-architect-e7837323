import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Travel Dashboard</h1>
        <p className="text-white mt-1">Manage your travel itineraries</p>
      </div>
      <Button 
        className="bg-navy hover:bg-navy-light border border-white"
        onClick={() => navigate("/trips/create")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create New Trip
      </Button>
    </div>
  );
}