import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TripMetadata } from "./trip/TripMetadata";
import { useQueryClient } from "@tanstack/react-query";
import { TripCardHeader } from "./trip/TripCardHeader";
import { useArchiveTrip } from "@/hooks/useArchiveTrip";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "in-progress" | "confirmed";
  archived?: boolean;
  segments?: any[];
}

export function TripCard({ 
  id, 
  title, 
  destination, 
  startDate, 
  endDate, 
  travelers, 
  status, 
  archived,
  segments 
}: TripCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { archiveTrip } = useArchiveTrip();
  
  // Calculate actual traveler count from segments
  const actualTravelerCount = segments?.reduce((count, segment) => {
    if (segment.details?.traveller_names?.length > count) {
      return segment.details.traveller_names.length;
    }
    return count;
  }, 0) || travelers; // Fallback to the travelers prop if no segments data

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success("Trip deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('[role="dialog"]') && 
        !(e.target as HTMLElement).closest('.action-button') &&
        !(e.target as HTMLElement).closest('[role="button"]')) {
      navigate(`/trips/${id}`);
    }
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer relative animate-in fade-in-50 duration-300 w-full" 
      onClick={handleCardClick}
    >
      <TripCardHeader
        id={id}
        title={title}
        destination={destination}
        status={status}
        onDelete={handleDelete}
        onArchive={() => archiveTrip(id, !!archived)}
        archived={archived}
      />
      <CardContent className="p-4 sm:p-6">
        <TripMetadata 
          startDate={startDate}
          endDate={endDate}
          travelers={actualTravelerCount}
        />
      </CardContent>
    </Card>
  );
}