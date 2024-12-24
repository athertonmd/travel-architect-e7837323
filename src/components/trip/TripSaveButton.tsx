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

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      const segments = nodes.map(node => ({
        type: String(node.data.label).toLowerCase(),
        details: node.data.details,
        position: {
          x: node.position.x,
          y: node.position.y
        }
      }));

      const firstSegmentLocation = nodes[0]?.data?.details?.location;

      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: profile.id,
          title: title,
          destination: firstSegmentLocation || "Unknown",
          travelers: travelers,
          segments: segments as any
        });

      if (error) throw error;

      toast.success("Trip saved successfully!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button 
      onClick={handleSaveTrip} 
      className="bg-navy hover:bg-navy-light border border-white"
    >
      Save Trip
    </Button>
  );
};