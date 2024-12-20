import {
  Connection,
  Edge,
  Node,
  OnSelectionChangeParams,
  ReactFlowProvider,
} from '@xyflow/react';
import { useCallback } from "react";
import { SegmentNodeData } from "@/types/segment";
import { useFlowDragDrop } from "./FlowDragDrop";
import { useFlowManagement } from "@/hooks/useFlowManagement";
import { useFlowState } from "@/hooks/useFlowState";
import { FlowContent } from "./flow/FlowContent";

interface FlowEditorProps {
  onNodesChange?: (nodes: Node<SegmentNodeData>[]) => void;
  onNodeSelect?: (node: Node<SegmentNodeData> | null) => void;
  initialNodes?: Node<SegmentNodeData>[];
  readOnly?: boolean;
}

const FlowEditorContent = ({ 
  onNodesChange: onNodesUpdate, 
  onNodeSelect,
  initialNodes = [],
  readOnly = false 
}: FlowEditorProps) => {
  const { reorganizeNodes, updateEdges } = useFlowManagement();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onNodesDelete
  } = useFlowState(initialNodes, readOnly, onNodesUpdate, reorganizeNodes, updateEdges);

  const handleSelectionChange = useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    if (onNodeSelect) {
      const selectedNode = selectedNodes[0] as Node<SegmentNodeData> | undefined;
      onNodeSelect(selectedNode || null);
    }
  }, [onNodeSelect]);

  const { onDragOver, onDrop } = useFlowDragDrop({ 
    nodes, 
    readOnly, 
    onNodesChange: (newNodes) => {
      const updatedNodes = reorganizeNodes(newNodes);
      if (onNodesUpdate) {
        onNodesUpdate(updatedNodes);
      }
    }
  });

  return (
    <FlowContent
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onNodesDelete={onNodesDelete}
      onSelectionChange={handleSelectionChange}
      onDragOver={onDragOver}
      onDrop={onDrop}
      readOnly={readOnly}
    />
  );
};

export const FlowEditor = (props: FlowEditorProps) => (
  <ReactFlowProvider>
    <FlowEditorContent {...props} />
  </ReactFlowProvider>
);