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

export function useTripUpdates() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ tripId, title, nodes }: UpdateTripParams) => {
      console.log('Updating trip:', { tripId, title, nodes });
      
      const { error } = await supabase
        .from('trips')
        .update({
          title,
          segments: nodes,
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