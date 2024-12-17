import { useState } from "react";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

export function useNodeManagement(initialNodes: Node<SegmentNodeData>[] = []) {
  const [nodes, setNodes] = useState<Node<SegmentNodeData>[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<Node<SegmentNodeData> | null>(null);

  const handleNodesChange = (newNodes: Node<SegmentNodeData>[]) => {
    setNodes(newNodes);
  };

  const handleNodeSelect = (node: Node<SegmentNodeData> | null) => {
    setSelectedNode(node);
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

  return {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  };
}