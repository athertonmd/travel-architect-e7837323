import { useCallback, useEffect } from "react";
import { Node, useNodesState, useEdgesState, Connection, Edge, addEdge } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { toast } from "sonner";

export function useFlowState(
  initialNodes: Node<SegmentNodeData>[],
  readOnly: boolean,
  onNodesUpdate?: (nodes: Node<SegmentNodeData>[]) => void,
  reorganizeNodes: (nodes: Node<SegmentNodeData>[]) => void,
  updateEdges: (nodes: Node<SegmentNodeData>[]) => Edge[]
) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SegmentNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setTimeout(() => {
        const updatedNodes = reorganizeNodes(initialNodes);
        setNodes(updatedNodes);
        setEdges(updateEdges(updatedNodes));
      }, 50);
    }
  }, [initialNodes, reorganizeNodes, setNodes, setEdges, updateEdges]);

  const handleConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeDragStop = useCallback(() => {
    if (readOnly) return;
    
    setNodes((nds) => {
      const updatedNodes = reorganizeNodes(nds);
      setEdges(updateEdges(updatedNodes));
      if (onNodesUpdate) {
        onNodesUpdate(updatedNodes);
        toast.success("Trip sequence updated");
      }
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges, readOnly, onNodesUpdate]);

  const handleNodesDelete = useCallback((nodesToDelete: Node<SegmentNodeData>[]) => {
    if (readOnly) return;

    setNodes((nds) => {
      const remainingNodes = nds.filter(
        (node) => !nodesToDelete.find((n) => n.id === node.id)
      );
      const updatedNodes = reorganizeNodes(remainingNodes);
      setEdges(updateEdges(updatedNodes));
      if (onNodesUpdate) {
        onNodesUpdate(updatedNodes);
      }
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges, readOnly, onNodesUpdate]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect: handleConnect,
    onNodeDragStop: handleNodeDragStop,
    onNodesDelete: handleNodesDelete
  };
}