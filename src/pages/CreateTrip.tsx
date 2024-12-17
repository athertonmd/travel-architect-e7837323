import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentNode } from "@/components/SegmentNode";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
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
const VERTICAL_PADDING = 100;

const CreateTrip = () => {
  const navigate = useNavigate();
  const user = useUser();
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

      const y = event.clientY - reactFlowBounds.top;
      const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
      
      let insertY = y;
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

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: "segment",
        position: { x: CANVAS_CENTER - 100, y: insertY },
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1), 
          icon: segmentIcons[type],
          details: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("You must be logged in to save a trip");
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .single();

      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: profile.id,
          title: tripTitle,
          destination: nodes.find(node => node.type === "segment")?.data?.details?.location || "Unknown",
          segments: nodes.map(node => ({
            type: node.data.label.toLowerCase(),
            details: node.data.details,
            position: node.position
          }))
        });

      if (error) throw error;

      toast.success("Trip saved successfully!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

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