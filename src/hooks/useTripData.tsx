import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { toast } from "sonner";

interface TripData {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  status: string;
  segments: any;
  archived: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useTripData(
  tripId: string | undefined,
  setNodes: (nodes: Node<SegmentNodeData>[]) => void,
  setTitle: (title: string) => void
) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (!tripId) throw new Error('Trip ID is required');

      console.log('Fetching trip data for ID:', tripId);
      
      const { data: trip, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) {
        console.error('Error fetching trip:', error);
        toast.error('Failed to load trip data');
        throw error;
      }

      if (!trip) {
        console.error('No trip found with ID:', tripId);
        toast.error('Trip not found');
        throw new Error('Trip not found');
      }

      console.log('Fetched trip data:', trip);

      // Update nodes if segments exist
      if (trip.segments && Array.isArray(trip.segments)) {
        console.log('Setting nodes from segments:', trip.segments);
        setNodes(trip.segments);
      }

      // Update title
      if (trip.title) {
        console.log('Setting title:', trip.title);
        setTitle(trip.title);
      }

      return trip as TripData;
    },
    enabled: !!tripId,
    staleTime: 0,
    gcTime: 0,
    meta: {
      errorMessage: 'Failed to load trip data'
    }
  });
}