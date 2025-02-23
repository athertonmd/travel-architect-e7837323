
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
  status: "draft" | "sent";
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
  }, 0) || 0;

  // Find earliest date from segments
  const earliestDate = segments?.reduce((earliest, segment) => {
    const segmentDate = segment.details?.date || segment.details?.departureDate;
    if (segmentDate && (!earliest || new Date(segmentDate) < new Date(earliest))) {
      return segmentDate;
    }
    return earliest;
  }, null) || startDate; // Fallback to startDate if no segment dates found

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
      className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer relative animate-in fade-in-50 w-full" 
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
          earliestDate={earliestDate}
        />
      </CardContent>
    </Card>
  );
}
