import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TripStatusBadge } from "./trip/TripStatusBadge";
import { TripActions } from "./trip/TripActions";
import { TripMetadata } from "./trip/TripMetadata";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "confirmed" | "in-progress" | "completed";
  archived?: boolean;
}

export function TripCard({ 
  id, 
  title, 
  destination, 
  startDate, 
  endDate, 
  travelers, 
  status, 
  archived 
}: TripCardProps) {
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Trip deleted successfully");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleArchive = async () => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ archived: !archived })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(archived ? "Trip unarchived successfully" : "Trip archived successfully");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[role="dialog"]') || 
        (e.target as HTMLElement).closest('.action-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/trips/${id}`);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer relative" 
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {destination}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TripStatusBadge status={status} />
            <TripActions 
              onDelete={handleDelete}
              onArchive={handleArchive}
              archived={archived}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TripMetadata 
          startDate={startDate}
          endDate={endDate}
          travelers={travelers}
        />
      </CardContent>
    </Card>
  );
}