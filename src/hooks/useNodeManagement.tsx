import { useState, useCallback } from "react";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

export function useNodeManagement(initialNodes: Node<SegmentNodeData>[] = []) {
  const [nodes, setNodes] = useState<Node<SegmentNodeData>[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<Node<SegmentNodeData> | null>(null);

  const handleNodesChange = useCallback((newNodes: Node<SegmentNodeData>[]) => {
    console.log('Nodes changed:', newNodes); // Add this for debugging
    setNodes(newNodes);
  }, []);

  const handleNodeSelect = useCallback((node: Node<SegmentNodeData> | null) => {
    console.log('Node selected:', node); // Add this for debugging
    setSelectedNode(node);
  }, []);

  const handleDetailsChange = useCallback((nodeId: string, details: Record<string, unknown>) => {
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, details } }
          : node
      )
    );
  }, []);

  return {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  };
}