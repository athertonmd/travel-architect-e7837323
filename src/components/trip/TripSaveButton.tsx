import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Node } from "@xyflow/react";

interface TripSaveButtonProps {
  title: string;
  nodes: Node[];
  travelers: number;
}

type SegmentData = {
  type: string;
  details: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
};

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

      const segments: SegmentData[] = nodes.map(node => ({
        type: String(node.data.label).toLowerCase(),
        details: node.data.details || {},
        position: node.position
      }));

      const firstSegmentDetails = nodes[0]?.data?.details as Record<string, unknown> | undefined;
      const firstSegmentLocation = firstSegmentDetails?.location as string | undefined;

      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: profile.id,
          title: title,
          destination: firstSegmentLocation || "Unknown",
          travelers: travelers,
          segments: segments
        });

      if (error) throw error;

      toast.success("Trip saved successfully!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button onClick={handleSaveTrip} className="bg-primary">
      Save Trip
    </Button>
  );
};