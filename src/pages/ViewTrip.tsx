import { Layout } from "@/components/Layout";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { useState } from "react";
import { toast } from "sonner";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { useTripData } from "@/hooks/useTripData";
import { TripHeader } from "@/components/trip/TripHeader";

const ViewTrip = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  } = useNodeManagement([]);

  const { data: trip } = useTripData(id, setNodes, setTitle);

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
          updated_at: new Date().toISOString(),
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
        <TripHeader 
          title={title}
          onTitleChange={setTitle}
          travelers={trip?.travelers}
          onSave={handleSave}
        />

        <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="h-full p-4">
              <SegmentPalette />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <FlowEditor 
              onNodesChange={handleNodesChange}
              onNodeSelect={handleNodeSelect}
              initialNodes={nodes}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
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