import { Layout } from "@/components/Layout";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

const ViewTrip = () => {
  const { id } = useParams();

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div>Trip not found</div>
      </Layout>
    );
  }

  const nodes: Node<SegmentNodeData>[] = trip.segments.map((segment: any, index: number) => ({
    id: `${segment.type}-${index + 1}`,
    type: 'segment',
    position: segment.position,
    data: {
      label: segment.type.charAt(0).toUpperCase() + segment.type.slice(1),
      icon: segmentIcons[segment.type as keyof typeof segmentIcons],
      details: segment.details,
    },
    dragHandle: '.drag-handle',
  }));

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <div className="text-sm text-muted-foreground">
            {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
          </div>
        </div>

        <div className="flex-1 rounded-lg border">
          <FlowEditor 
            initialNodes={nodes}
            readOnly={true}
          />
        </div>
      </div>
    </Layout>
  );
};

const segmentIcons = {
  flight: "✈️",
  hotel: "🏨",
  limo: "🚙",
  car: "🚗",
  restaurant: "🍽️",
  activity: "🎯",
  transfer: "🚕",
  vip: "👑",
} as const;

export default ViewTrip;