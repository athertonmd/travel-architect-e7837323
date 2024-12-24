import { Layout } from "@/components/Layout";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SegmentPalette } from "@/components/SegmentPalette";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { useState } from "react";
import { toast } from "sonner";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { useTripData } from "@/hooks/useTripData";
import { TripHeader } from "@/components/trip/TripHeader";
import { SendItineraryDialog } from "@/components/trip/SendItineraryDialog";
import { Node } from "@xyflow/react";
import { SegmentNodeData, SupabaseJsonSegment } from "@/types/segment";

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
  } = useNodeManagement([]);

  const { data: trip } = useTripData(id, setNodes, setTitle);

  const handleSave = async () => {
    try {
      if (!id) {
        toast.error("Invalid trip ID");
        return;
      }

      const segments: SupabaseJsonSegment[] = nodes.map((node) => ({
        type: String(node.data.label).toLowerCase(),
        details: node.data.details || {},
        position: {
          x: node.position.x,
          y: node.position.y
        }
      }));

      const firstSegmentLocation = nodes[0]?.data?.details?.location || "Unknown";

      const { error } = await supabase
        .from('trips')
        .update({
          title,
          destination: firstSegmentLocation,
          segments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Trip updated successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
      console.error("Save error:", error);
    }
  };

  // Extract unique travelers from all segments
  const travelers = nodes.reduce((acc: { email: string; name: string }[], node) => {
    const travellerNames = node.data.details?.traveller_names || [];
    const travellerEmails = node.data.details?.emails || [];
    
    travellerNames.forEach((name: string, index: number) => {
      const email = travellerEmails[index];
      if (email && !acc.some(t => t.email === email)) {
        acc.push({ email, name });
      }
    });
    
    return acc;
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <TripHeader 
            title={title}
            onTitleChange={setTitle}
            travelers={trip?.travelers}
            onSave={handleSave}
            tripId={id}
          />
          {id && <SendItineraryDialog tripId={id} travelers={travelers} />}
        </div>

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