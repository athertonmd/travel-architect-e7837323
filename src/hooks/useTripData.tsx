import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentData } from "@/types/segment";
import { segmentIcons } from "@/utils/segmentIcons";
import { CANVAS_CENTER, VERTICAL_SPACING, TOP_MARGIN } from "@/constants/layout";

export function useTripData(id: string | undefined, setNodes: (nodes: Node<SegmentNodeData>[]) => void, setTitle: (title: string) => void) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      if (!id) {
        toast.error('Invalid trip ID');
        return null;
      }

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

      setTitle(data.title);
      
      if (data.segments && Array.isArray(data.segments)) {
        console.log('Processing segments:', data.segments);
        
        const initialNodes: Node<SegmentNodeData>[] = (data.segments as unknown as SegmentData[]).map((segment, index) => ({
          id: `${segment.type}-${index + 1}`,
          type: 'segment',
          position: {
            x: CANVAS_CENTER - 100,
            y: TOP_MARGIN + (index * VERTICAL_SPACING)
          },
          data: {
            label: segment.type.charAt(0).toUpperCase() + segment.type.slice(1),
            icon: segmentIcons[segment.type as keyof typeof segmentIcons],
            details: segment.details || {},
            onSelect: (id: string) => {
              const node = initialNodes.find(n => n.id === id);
              // Note: handleNodeSelect will be passed through props
            }
          },
          dragHandle: '.drag-handle',
        }));
        
        console.log('Setting nodes:', initialNodes);
        setNodes(initialNodes);
      }

      return data;
    },
    refetchOnWindowFocus: false,
  });
}