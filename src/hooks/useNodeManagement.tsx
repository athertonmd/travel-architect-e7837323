
import { useState, useCallback } from "react";
import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentDetails } from "@/types/segment";

export function useNodeManagement(initialNodes: Node<SegmentNodeData>[] = []) {
  const [nodes, setNodes] = useState<Node<SegmentNodeData>[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<Node<SegmentNodeData> | null>(null);

  const handleNodesChange = useCallback((newNodes: Node<SegmentNodeData>[]) => {
    // Prevent unnecessary updates by checking if nodes have actually changed
    setNodes(currentNodes => {
      const hasChanged = JSON.stringify(currentNodes) !== JSON.stringify(newNodes);
      return hasChanged ? newNodes : currentNodes;
    });
  }, []);

  const handleNodeSelect = useCallback((node: Node<SegmentNodeData> | null) => {
    console.log('Node selected:', node);
    setSelectedNode(node);
  }, []);

  const handleDetailsChange = useCallback((nodeId: string, details: SegmentDetails) => {
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
