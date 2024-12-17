import { Layout } from "@/components/Layout";
import { SegmentPalette } from "@/components/SegmentPalette";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { TripSaveButton } from "@/components/trip/TripSaveButton";
import { TravelersSelect } from "@/components/trip/TravelersSelect";
import { Node } from "@xyflow/react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { SegmentNodeData } from "@/types/segment";

const CreateTrip = () => {
  const [tripTitle, setTripTitle] = useState("Create New Trip");
  const [travelers, setTravelers] = useState(1);
  const [nodes, setNodes] = useState<Node<SegmentNodeData>[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<SegmentNodeData> | null>(null);

  const handleNodesChange = (newNodes: Node<SegmentNodeData>[]) => {
    setNodes(newNodes);
  };

  const handleDetailsChange = (nodeId: string, details: Record<string, unknown>) => {
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, details } }
          : node
      )
    );
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
            <FlowEditor 
              onNodesChange={handleNodesChange} 
              onNodeSelect={setSelectedNode}
            />
          </ResizablePanel>
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