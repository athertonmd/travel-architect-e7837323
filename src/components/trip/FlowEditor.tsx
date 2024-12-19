import {
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  OnSelectionChangeParams,
  ReactFlowProvider,
} from '@xyflow/react';
import { useCallback, useEffect } from "react";
import { SegmentNodeData } from "@/types/segment";
import { useFlowDragDrop } from "./FlowDragDrop";
import { useFlowManagement } from "@/hooks/useFlowManagement";
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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SegmentNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { reorganizeNodes, updateEdges } = useFlowManagement();

  useEffect(() => {
    if (initialNodes.length > 0) {
      // Add a small delay to ensure nodes are measured
      setTimeout(() => {
        const updatedNodes = reorganizeNodes(initialNodes);
        setNodes(updatedNodes);
        setEdges(updateEdges(updatedNodes));
      }, 50);
    }
  }, [initialNodes, reorganizeNodes, setNodes, setEdges, updateEdges]);

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
      setNodes(updatedNodes);
      setEdges(updateEdges(updatedNodes));
      if (onNodesUpdate) {
        onNodesUpdate(updatedNodes);
      }
    }
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(() => {
    if (readOnly) return;
    
    setNodes((nds) => {
      const updatedNodes = reorganizeNodes(nds);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges, readOnly]);

  const onNodesDelete = useCallback((nodesToDelete: Node<SegmentNodeData>[]) => {
    if (readOnly) return;

    setNodes((nds) => {
      const remainingNodes = nds.filter(
        (node) => !nodesToDelete.find((n) => n.id === node.id)
      );
      const updatedNodes = reorganizeNodes(remainingNodes);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges, readOnly]);

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