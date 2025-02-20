
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

// Helper function to transform database segments to React Flow nodes
const transformSegmentsToNodes = (segments: any[]): Node<SegmentNodeData>[] => {
  if (!Array.isArray(segments)) return [];
  
  return segments.map((segment: any) => ({
    id: segment.id,
    type: 'segment',
    position: segment.position || { x: 0, y: 0 },
    data: {
      label: segment.data?.label || segment.type || 'Unknown',
      icon: segment.data?.icon || segment.icon || '📍',
      details: segment.data?.details || segment.details || {}
    }
  }));
};

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
        .maybeSingle();

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
        const nodes = transformSegmentsToNodes(trip.segments);
        console.log('Transformed nodes:', nodes);
        setNodes(nodes);
      }

      // Update title
      if (trip.title) {
        console.log('Setting title:', trip.title);
        setTitle(trip.title);
      }

      return trip as TripData;
    },
    enabled: !!tripId,
    gcTime: 0,
    staleTime: 0,
    meta: {
      errorMessage: 'Failed to load trip data'
    }
  });
}
