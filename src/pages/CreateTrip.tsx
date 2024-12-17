import { Layout } from "@/components/Layout";
import { SegmentPalette } from "@/components/SegmentPalette";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { TripSaveButton } from "@/components/trip/TripSaveButton";
import { TravelersSelect } from "@/components/trip/TravelersSelect";
import { Node } from "@xyflow/react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

const CreateTrip = () => {
  const [tripTitle, setTripTitle] = useState("Create New Trip");
  const [travelers, setTravelers] = useState(1);
  const [nodes, setNodes] = useState<Node[]>([]);

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TripTitleHeader title={tripTitle} onTitleChange={setTripTitle} />
            <TravelersSelect onChange={setTravelers} />
          </div>
          <TripSaveButton title={tripTitle} nodes={nodes} travelers={travelers} />
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-4">
              <SegmentPalette />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={50} minSize={30}>
            <FlowEditor onNodesChange={handleNodesChange} />
          </ResizablePanel>
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full p-4 bg-white">
              <h3 className="font-semibold mb-4">Segment Details</h3>
              <p className="text-muted-foreground">Select a segment to view and edit its details</p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
};

export default CreateTrip;