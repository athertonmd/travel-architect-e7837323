import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentNode } from "@/components/SegmentNode";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const segmentIcons: Record<string, string> = {
  flight: "✈️",
  hotel: "🏨",
  limo: "🚙",
  car: "🚗",
  restaurant: "🍽️",
  activity: "🎯",
  transfer: "🚕",
  vip: "👑",
};

const CreateTrip = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tripTitle, setTripTitle] = useState("Create New Trip");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleTitleSubmit = () => {
    setIsEditing(false);
  };

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

      // Get the position of the drop relative to the flow container
      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 20,
        y: event.clientY - reactFlowBounds.top - 20,
      };

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "segment",
        position,
        data: { label: type.charAt(0).toUpperCase() + type.slice(1), icon: segmentIcons[type] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const nodeTypes = {
    segment: SegmentNode,
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTitleSubmit();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  type="text"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="text-3xl font-bold text-navy h-auto py-1"
                  autoFocus
                />
                <Button type="submit" size="sm" variant="ghost">
                  Save
                </Button>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-navy">{tripTitle}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-gray-600 mt-1">Build a new luxury travel itinerary</p>
        </div>

        <div className="flex gap-8">
          <SegmentPalette />
          <div className="flex-1 bg-white rounded-lg shadow-lg" style={{ height: "600px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDragOver={onDragOver}
              onDrop={onDrop}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;