import { useCallback } from "react";
import { Edge, Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { CANVAS_CENTER, VERTICAL_SPACING, TOP_MARGIN } from "@/constants/layout";

export function useFlowManagement() {
  const reorganizeNodes = useCallback((nodes: Node<SegmentNodeData>[]) => {
    // Sort nodes based on vertical position to determine sequence
    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    
    // Default node width if not specified (based on min-w-40 class)
    const DEFAULT_NODE_WIDTH = 160;
    
    return sortedNodes.map((node, index) => {
      const nodeWidth = node.width || 
                       (node.style?.width as number) || 
                       DEFAULT_NODE_WIDTH;
      
      return {
        ...node,
        position: {
          x: Math.round(CANVAS_CENTER - (nodeWidth / 2)),
          y: TOP_MARGIN + (index * VERTICAL_SPACING)
        },
        style: {
          ...node.style,
          width: nodeWidth,
        }
      };
    });
  }, []);

  const updateEdges = useCallback((nodes: Node<SegmentNodeData>[]) => {
    const newEdges: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      newEdges.push({
        id: `e${nodes[i].id}-${nodes[i + 1].id}`,
        source: nodes[i].id,
        target: nodes[i + 1].id,
        type: 'smoothstep',
        style: {
          strokeWidth: 2,
          stroke: '#b1b1b7',
        },
      });
    }
    return newEdges;
  }, []);

  return {
    reorganizeNodes,
    updateEdges,
  };
}