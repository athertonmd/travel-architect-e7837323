import { Layout } from "@/components/Layout";
import { SegmentPalette } from "@/components/SegmentPalette";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { TripSaveButton } from "@/components/trip/TripSaveButton";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { useNodeManagement } from "@/hooks/useNodeManagement";

const CreateTrip = () => {
  const [tripTitle, setTripTitle] = useState("Create New Trip");
  const [travelers, setTravelers] = useState(1); // Keep state for data consistency
  const {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  } = useNodeManagement();

  console.log('Selected Node:', selectedNode);

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TripTitleHeader title={tripTitle} onTitleChange={setTripTitle} />
          </div>
          <TripSaveButton title={tripTitle} nodes={nodes} travelers={travelers} />
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-4">
              <SegmentPalette />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <FlowEditor 
              onNodesChange={handleNodesChange}
              onNodeSelect={handleNodeSelect}
              initialNodes={nodes}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={20}>
            <SegmentDetails 
              selectedNode={selectedNode}
              onDetailsChange={handleDetailsChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
  );
};

export default CreateTrip;