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
      // Get the actual node width from the measured width, or fall back to style width, or use default
      const nodeWidth = node.width || 
                       (node.style?.width as number) || 
                       DEFAULT_NODE_WIDTH;
      
      return {
        ...node,
        // Ensure the node is centered by calculating its position relative to the canvas center
        position: {
          x: Math.round(CANVAS_CENTER - (nodeWidth / 2)),
          y: TOP_MARGIN + (index * VERTICAL_SPACING)
        },
        // Store the width in the node's style to maintain consistency
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