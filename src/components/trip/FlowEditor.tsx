import { ReactFlow, Background, Controls, Connection, Edge, useNodesState, useEdgesState, addEdge, Node, XYPosition, OnNodesChange } from "@xyflow/react";
import { SegmentNode } from "@/components/SegmentNode";
import { useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";

const CANVAS_WIDTH = 800;
const CANVAS_CENTER = CANVAS_WIDTH / 2;
const VERTICAL_PADDING = 60;
const TOP_MARGIN = 20;

interface FlowEditorProps {
  onNodesChange?: (nodes: Node[]) => void;
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

export const FlowEditor = ({ onNodesChange: onNodesUpdate }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    onNodesUpdate?.(nodes);
  }, [nodes, onNodesUpdate]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const reorganizeNodes = useCallback((nodes: Node[]) => {
    const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
    return sortedNodes.map((node, index) => ({
      ...node,
      position: {
        x: CANVAS_CENTER - 100,
        y: index === 0 ? TOP_MARGIN : TOP_MARGIN + (index * VERTICAL_PADDING)
      }
    }));
  }, []);

  const updateEdges = useCallback((nodes: Node[]) => {
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
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const y = event.clientY - reactFlowBounds.top;

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "segment",
        position: { x: CANVAS_CENTER - 100, y },
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1), 
          icon: segmentIcons[type as keyof typeof segmentIcons],
          details: {}
        },
        dragHandle: '.drag-handle',
      };

      const updatedNodes = reorganizeNodes([...nodes, newNode]);
      const updatedEdges = updateEdges(updatedNodes);

      setNodes(updatedNodes);
      setEdges(updatedEdges);
    },
    [nodes, setNodes, setEdges, reorganizeNodes, updateEdges]
  );

  const onNodeDragStop = useCallback(() => {
    setNodes((nds) => {
      const updatedNodes = reorganizeNodes(nds);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges]);

  const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
    setNodes((nds) => {
      const remainingNodes = nds.filter(
        (node) => !nodesToDelete.find((n) => n.id === node.id)
      );
      const updatedNodes = reorganizeNodes(remainingNodes);
      setEdges(updateEdges(updatedNodes));
      return updatedNodes;
    });
  }, [setNodes, setEdges, reorganizeNodes, updateEdges]);

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg" style={{ height: "600px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        selectionOnDrag
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
