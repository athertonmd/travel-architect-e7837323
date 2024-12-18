import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Node } from "@xyflow/react";
import { SegmentNodeData, SupabaseJsonSegment } from "@/types/segment";
import { segmentIcons } from "@/utils/segmentIcons";

const CANVAS_CENTER = 400;
const VERTICAL_SPACING = 60;
const TOP_MARGIN = 20;

export function useTripData(
  id: string | undefined, 
  setNodes: (nodes: Node<SegmentNodeData>[]) => void, 
  setTitle: (title: string) => void
) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      if (!id) {
        toast.error('Invalid trip ID');
        return null;
      }

      console.log('Fetching trip data for ID:', id);

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching trip:', error);
        toast.error('Error loading trip');
        return null;
      }

      if (!data) {
        toast.error('Trip not found');
        return null;
      }

      console.log('Raw trip data from Supabase:', data);
      setTitle(data.title);
      
      if (data.segments) {
        let segments: SupabaseJsonSegment[];
        try {
          segments = typeof data.segments === 'string' 
            ? JSON.parse(data.segments) 
            : data.segments;

          console.log('Parsed segments:', segments);
        } catch (e) {
          console.error('Error parsing segments:', e);
          segments = [];
        }
        
        const initialNodes: Node<SegmentNodeData>[] = segments.map((segment, index) => {
          const node: Node<SegmentNodeData> = {
            id: `${segment.type}-${index + 1}`,
            type: 'segment',
            position: segment.position || {
              x: CANVAS_CENTER - 100,
              y: TOP_MARGIN + (index * VERTICAL_SPACING)
            },
            data: {
              label: segment.type.charAt(0).toUpperCase() + segment.type.slice(1),
              icon: segmentIcons[segment.type as keyof typeof segmentIcons],
              details: segment.details || {},
            },
            dragHandle: '.drag-handle',
          };
          console.log('Created node:', node);
          return node;
        });
        
        console.log('Setting nodes:', initialNodes);
        setNodes(initialNodes);
      } else {
        console.log('No segments found or invalid segments data');
        setNodes([]);
      }

      return data;
    },
    refetchOnWindowFocus: false,
  });
}