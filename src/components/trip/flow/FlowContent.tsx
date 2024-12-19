import { 
  ReactFlow,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnSelectionChangeParams,
  useReactFlow,
  NodeTypes,
} from '@xyflow/react';
import { SegmentNode } from "@/components/SegmentNode";
import { useCallback } from "react";
import { SegmentNodeData } from "@/types/segment";
import { FlowConfiguration } from "./FlowConfiguration";
import "@xyflow/react/dist/style.css";

const nodeTypes: NodeTypes = {
  segment: SegmentNode,
};

const defaultEdgeOptions = {
  style: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
  },
  type: 'smoothstep',
  animated: true,
};

interface FlowContentProps {
  nodes: Node<SegmentNodeData>[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onNodeDragStop?: () => void;
  onNodesDelete?: (nodes: Node<SegmentNodeData>[]) => void;
  onSelectionChange?: (params: OnSelectionChangeParams) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  readOnly?: boolean;
}

export function FlowContent({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDragStop,
  onNodesDelete,
  onSelectionChange,
  onDragOver,
  onDrop,
  readOnly = false,
}: FlowContentProps) {
  const { fitView } = useReactFlow();

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 200 });
  }, [fitView]);

  return (
    <div className="h-full bg-gray-50/80">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={readOnly ? null : "Delete"}
        multiSelectionKeyCode={readOnly ? null : "Shift"}
        selectionOnDrag={!readOnly}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        selectNodesOnDrag={false}
      >
        <FlowConfiguration onFitView={handleFitView}>
          {/* Flow controls will be rendered here */}
        </FlowConfiguration>
      </ReactFlow>
    </div>
  );
}