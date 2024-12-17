import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentNode } from "@/components/SegmentNode";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
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

const CANVAS_WIDTH = 800;
const CANVAS_CENTER = CANVAS_WIDTH / 2;

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

      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      // Calculate vertical position based on drop location
      const y = event.clientY - reactFlowBounds.top;

      // Create new node at the center x position
      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "segment",
        position: { x: CANVAS_CENTER - 100, y }, // Center horizontally, keep vertical position
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1), 
          icon: segmentIcons[type],
          details: {} // Initialize empty details object
        },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        // Sort nodes by vertical position
        return newNodes.sort((a, b) => a.position.y - b.position.y);
      });
    },
    [nodes, setNodes]
  );

  const handleSaveTrip = () => {
    // Here you would typically save to your backend
    console.log("Saving trip:", {
      title: tripTitle,
      segments: nodes.map(node => ({
        type: node.data.label.toLowerCase(),
        position: node.position,
        details: node.data.details
      }))
    });
    
    toast.success("Trip saved successfully!");
  };

  const updateNodeDetails = useCallback((nodeId: string, details: any) => {
    setNodes(nodes => 
      nodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, details } }
          : node
      )
    );
  }, [setNodes]);

  const nodeTypes = {
    segment: SegmentNode,
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
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
          <Button onClick={handleSaveTrip} className="bg-primary">
            Save Trip
          </Button>
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