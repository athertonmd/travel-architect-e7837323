import { Layout } from "@/components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { useTripData } from "@/hooks/useTripData";
import { TripToolbar } from "@/components/trip/TripToolbar";
import { TripContent } from "@/components/trip/TripContent";

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

      const segments = nodes.map((node) => ({
        type: String(node.data.label).toLowerCase(),
        details: node.data.details || {},
        position: {
          x: node.position.x,
          y: node.position.y
        }
      }));

      const firstSegmentLocation = nodes[0]?.data?.details?.location as string || "Unknown";

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
    
    if (Array.isArray(travellerNames) && Array.isArray(travellerEmails)) {
      travellerNames.forEach((name: string, index: number) => {
        const email = travellerEmails[index];
        if (email && !acc.some(t => t.email === email)) {
          acc.push({ email: email as string, name });
        }
      });
    }
    
    return acc;
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <TripToolbar
          title={title}
          onTitleChange={setTitle}
          travelers={trip?.travelers}
          onSave={handleSave}
          tripId={id}
          emailRecipients={travelers}
        />
        <TripContent
          nodes={nodes}
          selectedNode={selectedNode}
          onNodesChange={handleNodesChange}
          onNodeSelect={handleNodeSelect}
          onDetailsChange={handleDetailsChange}
        />
      </div>
    </Layout>
  );
};

export default ViewTrip;