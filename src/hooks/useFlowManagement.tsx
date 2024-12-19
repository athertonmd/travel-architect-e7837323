import { useCallback } from "react";
import { Edge, Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { CANVAS_CENTER, VERTICAL_SPACING, TOP_MARGIN } from "@/constants/layout";

export function useFlowManagement() {
  const reorganizeNodes = useCallback((nodes: Node<SegmentNodeData>[]) => {
    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    
    // Default node width if not specified (based on min-w-40 class)
    const DEFAULT_NODE_WIDTH = 160;
    
    return sortedNodes.map((node, index) => {
      // Get the node's width or use default
      const nodeWidth = node.width || DEFAULT_NODE_WIDTH;
      
      return {
        ...node,
        position: {
          // Center the node by subtracting half its width from the canvas center
          x: CANVAS_CENTER - (nodeWidth / 2),
          y: index === 0 ? TOP_MARGIN : TOP_MARGIN + (index * VERTICAL_SPACING)
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