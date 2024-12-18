import { useCallback } from "react";
import { Node } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";
import { segmentIcons } from "@/utils/segmentIcons";

const CANVAS_CENTER = 400;

interface FlowDragDropProps {
  nodes: Node<SegmentNodeData>[];
  readOnly?: boolean;
  onNodesChange: (nodes: Node<SegmentNodeData>[]) => void;
  onNodeSelect?: (nodes: Node<SegmentNodeData>[]) => void;
}

export function useFlowDragDrop({ nodes, readOnly, onNodesChange, onNodeSelect }: FlowDragDropProps) {
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (readOnly) return;

      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const y = event.clientY - reactFlowBounds.top;

      const newNode: Node<SegmentNodeData> = {
        id: `${type}-${nodes.length + 1}`,
        type: "segment",
        position: { x: CANVAS_CENTER - 100, y },
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1), 
          icon: segmentIcons[type as keyof typeof segmentIcons],
          details: {},
        },
        dragHandle: '.drag-handle',
      };

      onNodesChange([...nodes, newNode]);
    },
    [nodes, onNodesChange, readOnly]
  );

  return {
    onDragOver,
    onDrop
  };
}