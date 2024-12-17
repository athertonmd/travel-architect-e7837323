import { Layout } from "@/components/Layout";
import { SegmentPalette } from "@/components/SegmentPalette";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { TripSaveButton } from "@/components/trip/TripSaveButton";
import { TravelersSelect } from "@/components/trip/TravelersSelect";
import { Node } from "@xyflow/react";

const CreateTrip = () => {
  const [tripTitle, setTripTitle] = useState("Create New Trip");
  const [travelers, setTravelers] = useState(1);
  const [nodes, setNodes] = useState<Node[]>([]);

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TripTitleHeader title={tripTitle} onTitleChange={setTripTitle} />
            <TravelersSelect onChange={setTravelers} />
          </div>
          <TripSaveButton title={tripTitle} nodes={nodes} travelers={travelers} />
        </div>

        <div className="flex gap-8">
          <SegmentPalette />
          <FlowEditor onNodesChange={handleNodesChange} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;