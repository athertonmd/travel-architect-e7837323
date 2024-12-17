import { useCallback } from "react";
import { Connection, Edge, Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

const CANVAS_WIDTH = 800;
const CANVAS_CENTER = CANVAS_WIDTH / 2;
const VERTICAL_PADDING = 60;
const TOP_MARGIN = 20;

export function useFlowManagement() {
  const reorganizeNodes = useCallback((nodes: Node<SegmentNodeData>[]) => {
    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    return sortedNodes.map((node, index) => ({
      ...node,
      position: {
        x: CANVAS_CENTER - 100,
        y: index === 0 ? TOP_MARGIN : TOP_MARGIN + (index * VERTICAL_PADDING)
      }
    }));
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