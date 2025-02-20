
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

interface TripSaveButtonProps {
  title: string;
  nodes: Node<SegmentNodeData>[];
  travelers: number;
}

export const TripSaveButton = ({ title, nodes, travelers }: TripSaveButtonProps) => {
  const navigate = useNavigate();
  const user = useUser();

  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("You must be logged in to save a trip");
      return;
    }

    if (nodes.length === 0) {
      toast.error("Please add at least one segment to your trip before saving");
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      const segments = nodes.map(node => ({
        id: node.id,
        type: String(node.data.label).toLowerCase(),
        icon: node.data.icon,
        position: node.position,
        details: node.data.details || {}
      }));

      const firstSegmentLocation = nodes[0]?.data?.details?.location || 
                                 nodes[0]?.data?.details?.destinationAirport || 
                                 "Unknown";

      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: profile.id,
          title: title,
          destination: firstSegmentLocation,
          travelers: travelers,
          segments: segments
        });

      if (error) throw error;

      toast.success("Trip saved successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving trip:', error);
      toast.error(error.message || "Failed to save trip");
    }
  };

  return (
    <Button 
      onClick={handleSaveTrip} 
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
    >
      Save Trip
    </Button>
  );
};
