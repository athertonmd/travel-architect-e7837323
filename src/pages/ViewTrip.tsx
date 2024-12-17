import { Layout } from "@/components/Layout";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentData } from "@/types/segment";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { toast } from "sonner";

const ViewTrip = () => {
  const { id } = useParams();
  const [selectedNode, setSelectedNode] = useState<Node<SegmentNodeData> | null>(null);
  const [nodes, setNodes] = useState<Node<SegmentNodeData>[]>([]);
  const [title, setTitle] = useState("");

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data) => {
        if (!data) return;
        
        setTitle(data.title);
        const segments = data.segments as SegmentData[] || [];
        
        if (segments && segments.length > 0) {
          const initialNodes: Node<SegmentNodeData>[] = segments.map((segment, index) => ({
            id: `${segment.type}-${index + 1}`,
            type: 'segment',
            position: segment.position,
            data: {
              label: segment.type.charAt(0).toUpperCase() + segment.type.slice(1),
              icon: segmentIcons[segment.type as keyof typeof segmentIcons],
              details: segment.details,
              onSelect: (id: string) => {
                const node = nodes.find(n => n.id === id);
                setSelectedNode(node || null);
              }
            },
            dragHandle: '.drag-handle',
          }));
          setNodes(initialNodes);
        }
      }
    }
  });

  const handleNodesChange = (newNodes: Node<SegmentNodeData>[]) => {
    setNodes(newNodes);
  };

  const handleNodeSelect = (node: Node<SegmentNodeData> | null) => {
    setSelectedNode(node);
  };

  const handleDetailsChange = (nodeId: string, details: Record<string, unknown>) => {
    setNodes(currentNodes => 
      currentNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, details } }
          : node
      )
    );
  };

  const handleSave = async () => {
    if (!trip) return;

    const segments = nodes.map(node => ({
      type: String(node.data.label).toLowerCase(),
      details: node.data.details,
      position: node.position
    }));

    const { error } = await supabase
      .from('trips')
      .update({
        title,
        segments: segments as any,
      })
      .eq('id', id);

    if (error) {
      toast.error("Failed to save changes");
      return;
    }

    toast.success("Changes saved successfully!");
  };

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div>Trip not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TripTitleHeader title={title} onTitleChange={setTitle} />
            <div className="text-sm text-muted-foreground">
              {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-4">
              <SegmentPalette />
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={50} minSize={30}>
            <FlowEditor 
              onNodesChange={handleNodesChange}
              onNodeSelect={handleNodeSelect}
              initialNodes={nodes}
            />
          </ResizablePanel>
          <ResizablePanel defaultSize={30} minSize={20}>
            <SegmentDetails 
              selectedNode={selectedNode}
              onDetailsChange={handleDetailsChange}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Layout>
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

export default ViewTrip;