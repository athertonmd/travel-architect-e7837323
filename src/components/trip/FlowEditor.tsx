import { ReactFlow, Background, Controls, Connection, Edge, useNodesState, useEdgesState, addEdge, Node } from "@xyflow/react";
import { SegmentNode } from "@/components/SegmentNode";
import { useCallback, useEffect, useState } from "react";
import { SegmentNodeData } from "@/types/segment";
import "@xyflow/react/dist/style.css";

const CANVAS_WIDTH = 800;
const CANVAS_CENTER = CANVAS_WIDTH / 2;
const VERTICAL_PADDING = 60;
const TOP_MARGIN = 20;

interface FlowEditorProps {
  onNodesChange?: (nodes: Node<SegmentNodeData>[]) => void;
  onNodeSelect?: (node: Node<SegmentNodeData> | null) => void;
  initialNodes?: Node<SegmentNodeData>[];
  readOnly?: boolean;
}

const nodeTypes = {
  segment: SegmentNode,
};

const defaultEdgeOptions = {
  style: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
  },
  type: 'smoothstep',
  animated: false,
};

export const FlowEditor = ({ 
  onNodesChange: onNodesUpdate, 
  onNodeSelect,
  initialNodes = [],
  readOnly = false 
}: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SegmentNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(updateEdges(initialNodes));
    }
  }, [initialNodes, setNodes, setEdges]);

  useEffect(() => {
    onNodesUpdate?.(nodes);
  }, [nodes, onNodesUpdate]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
        style: defaultEdgeOptions.style,
      });
    }
    return newEdges;
  }, []);

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
          onSelect: (id: string) => {
            setSelectedNodeId(id);
            const node = nodes.find(n => n.id === id);
            onNodeSelect?.(node || null);
          }
        },
        dragHandle: '.drag-handle',
      };

      const updatedNodes = reorganizeNodes([...nodes, newNode]);
      const updatedEdges = updateEdges(updatedNodes);

      setNodes(updatedNodes);
      setEdges(updatedEdges);
    },
    [nodes, setNodes, setEdges, reorganizeNodes, updateEdges, onNodeSelect, readOnly]
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
    <div className="h-full bg-white">
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          selected: node.id === selectedNodeId
        }))}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={readOnly ? null : "Delete"}
        multiSelectionKeyCode={readOnly ? null : "Shift"}
        selectionOnDrag={!readOnly}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const segmentIcons = {
  flight: "✈️",
  hotel: "🏨",
  limo: "🚙",
  car: "🚗",
  restaurant: "🍽️",
  activity: "🎯",
  transfer: "🚕",
  vip: "👑",
} as const;