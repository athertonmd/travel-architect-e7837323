import { ReactFlow, Background, Controls, Connection, Edge, useNodesState, useEdgesState, addEdge, Node } from "@xyflow/react";
import { SegmentNode } from "@/components/SegmentNode";
import { useCallback } from "react";
import "@xyflow/react/dist/style.css";

const CANVAS_WIDTH = 800;
const CANVAS_CENTER = CANVAS_WIDTH / 2;
const VERTICAL_PADDING = 60;
const TOP_MARGIN = 20; // New constant for top margin

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

export const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
      const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
      
      let insertY = y;

      // If this is the first node, snap it to the top
      if (sortedNodes.length === 0) {
        insertY = TOP_MARGIN;
      } else {
        let prevNode = null;
        let nextNode = null;

        for (let i = 0; i < sortedNodes.length; i++) {
          if (sortedNodes[i].position.y > y) {
            nextNode = sortedNodes[i];
            prevNode = i > 0 ? sortedNodes[i - 1] : null;
            break;
          }
        }

        if (!nextNode) {
          prevNode = sortedNodes[sortedNodes.length - 1];
        }

        if (prevNode && nextNode) {
          insertY = prevNode.position.y + (nextNode.position.y - prevNode.position.y) / 2;
        } else if (prevNode) {
          insertY = prevNode.position.y + VERTICAL_PADDING;
        } else if (nextNode) {
          insertY = nextNode.position.y - VERTICAL_PADDING;
        }
      }

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "segment",
        position: { x: CANVAS_CENTER - 100, y: insertY },
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1), 
          icon: segmentIcons[type as keyof typeof segmentIcons],
          details: {}
        },
        dragHandle: '.drag-handle', // Enable dragging only from specific area
      };

      // Add edge to previous node if it exists
      const newEdges = [...edges];
      if (sortedNodes.length > 0) {
        const lastNode = sortedNodes[sortedNodes.length - 1];
        newEdges.push({
          id: `e${lastNode.id}-${newNode.id}`,
          source: lastNode.id,
          target: newNode.id,
          type: 'smoothstep',
          style: defaultEdgeOptions.style,
        });
      }

      setNodes((nds) => nds.concat(newNode));
      setEdges(newEdges);
    },
    [nodes, edges, setNodes, setEdges]
  );

  // Automatically reorganize nodes when they're moved
  const onNodeDragStop = useCallback(() => {
    setNodes((nds) => {
      const sortedNodes = [...nds].sort((a, b) => a.position.y - b.position.y);
      return sortedNodes.map((node, index) => ({
        ...node,
        position: {
          x: node.position.x,
          y: index === 0 ? TOP_MARGIN : sortedNodes[index - 1].position.y + VERTICAL_PADDING
        }
      }));
    });
  }, [setNodes]);

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
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        selectNodesOnDrag={true}
        multiSelectionKeyCode="Shift"
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