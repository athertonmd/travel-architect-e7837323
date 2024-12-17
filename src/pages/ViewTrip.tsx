import { Layout } from "@/components/Layout";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { toast } from "sonner";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { segmentIcons } from "@/utils/segmentIcons";
import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentData } from "@/types/segment";

const ViewTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  } = useNodeManagement();

  const { data: trip } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      if (!id) {
        navigate('/');
        toast.error('Invalid trip ID');
        return null;
      }

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          navigate('/');
          toast.error('Trip not found');
          return null;
        }
        throw error;
      }

      if (!data) {
        navigate('/');
        toast.error('Trip not found');
        return null;
      }

      setTitle(data.title);
      
      // Convert segments data to nodes if segments exist
      if (data.segments && Array.isArray(data.segments)) {
        const initialNodes: Node<SegmentNodeData>[] = (data.segments as SegmentData[]).map((segment, index) => ({
          id: `${segment.type}-${index + 1}`,
          type: 'segment',
          position: segment.position || { x: 0, y: index * 100 }, // Fallback position if none exists
          data: {
            label: segment.type.charAt(0).toUpperCase() + segment.type.slice(1),
            icon: segmentIcons[segment.type as keyof typeof segmentIcons],
            details: segment.details || {},
            onSelect: (id: string) => {
              const node = nodes.find(n => n.id === id);
              handleNodeSelect(node || null);
            }
          },
          dragHandle: '.drag-handle',
        }));
        setNodes(initialNodes);
      }

      return data;
    },
  });

  if (!trip) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="animate-pulse">Loading trip...</div>
        </div>
      </Layout>
    );
  }

  const handleSave = async () => {
    if (!trip || !id) return;

    const segments = nodes.map(node => ({
      type: String(node.data.label).toLowerCase(),
      details: node.data.details,
      position: node.position
    }));

    try {
      const { error } = await supabase
        .from('trips')
        .update({
          title,
          segments: segments as any,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Changes saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save changes");
      console.error("Save error:", error);
    }
  };

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

export default ViewTrip;