import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UpdateTripParams {
  tripId: string;
  title: string;
  nodes: Node<SegmentNodeData>[];
}

// Helper function to transform React Flow nodes to database segments
const transformNodesToSegments = (nodes: Node<SegmentNodeData>[]) => {
  return nodes.map(node => ({
    id: node.id,
    type: node.data.label,
    icon: node.data.icon,
    position: node.position,
    details: node.data.details || {}
  }));
};

export function useTripUpdates() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ tripId, title, nodes }: UpdateTripParams) => {
      console.log('Updating trip:', { tripId, title, nodes });
      
      const segments = transformNodesToSegments(nodes);
      
      const { error } = await supabase
        .from('trips')
        .update({
          title,
          segments,
          updated_at: new Date().toISOString()
        })
        .eq('id', tripId);

      if (error) {
        console.error('Error updating trip:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Trip updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip'] });
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error("Failed to update trip");
    }
  });
}