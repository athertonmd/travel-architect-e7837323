
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { toast } from "sonner";
import { TripsRow } from "@/integrations/supabase/types/trips";

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
      const typedTrip = trip as TripsRow;

      // Update nodes if segments exist
      if (typedTrip.segments && Array.isArray(typedTrip.segments)) {
        console.log('Setting nodes from segments:', typedTrip.segments);
        const nodes = transformSegmentsToNodes(typedTrip.segments);
        console.log('Transformed nodes:', nodes);
        setNodes(nodes);
      }

      // Update title
      if (typedTrip.title) {
        console.log('Setting title:', typedTrip.title);
        setTitle(typedTrip.title);
      }

      return typedTrip;
    },
    enabled: !!tripId,
    gcTime: 0,
    staleTime: 0,
    meta: {
      errorMessage: 'Failed to load trip data'
    }
  });
}
