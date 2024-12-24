import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SegmentPalette } from "@/components/SegmentPalette";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

interface TripContentProps {
  nodes: Node<SegmentNodeData>[];
  selectedNode: Node<SegmentNodeData> | null;
  onNodesChange: (nodes: Node<SegmentNodeData>[]) => void;
  onNodeSelect: (node: Node<SegmentNodeData> | null) => void;
  onDetailsChange: (nodeId: string, details: any) => void;
}

export function TripContent({
  nodes,
  selectedNode,
  onNodesChange,
  onNodeSelect,
  onDetailsChange,
}: TripContentProps) {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
      <ResizablePanel defaultSize={20} minSize={15}>
        <div className="h-full p-4">
          <SegmentPalette />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        <FlowEditor 
          onNodesChange={onNodesChange}
          onNodeSelect={onNodeSelect}
          initialNodes={nodes}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={20}>
        <SegmentDetails 
          selectedNode={selectedNode}
          onDetailsChange={onDetailsChange}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}