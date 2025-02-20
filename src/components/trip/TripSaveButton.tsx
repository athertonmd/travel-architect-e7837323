
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface TripSaveButtonProps {
  title: string;
  nodes: Node<SegmentNodeData>[];
  travelers: number;
}

export function TripSaveButton({ title, nodes, travelers }: TripSaveButtonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("You must be logged in to save a trip");
        return;
      }

      // Transform nodes to a format compatible with Supabase's Json type
      const transformedSegments = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          icon: node.data.icon,
          details: node.data.details
        }
      }));

      // Get destination from first node if available
      const firstSegmentDestination = nodes[0]?.data?.details?.location || 
                                    nodes[0]?.data?.details?.destinationAirport || 
                                    undefined;

      console.log('Saving trip:', { title, segments: transformedSegments, travelers });

      const { data: trip, error } = await supabase
        .from('trips')
        .insert({
          title,
          segments: transformedSegments,
          travelers,
          user_id: session.user.id,
          status: 'draft',
          destination: firstSegmentDestination
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Trip saved successfully:', trip);
      
      // Immediately invalidate and refetch trips
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      // Force a refetch
      await queryClient.refetchQueries({ queryKey: ['trips'] });
      
      toast.success("Trip saved successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving trip:', error);
      toast.error(error.message);
    }
  };

  return (
    <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
      Save Trip
    </Button>
  );
}
