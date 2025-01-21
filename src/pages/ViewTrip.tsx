import { useParams } from "react-router-dom";
import { TripToolbar } from "@/components/trip/TripToolbar";
import { TripContent } from "@/components/trip/TripContent";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { useTripData } from "@/hooks/useTripData";
import { useTripUpdates } from "@/hooks/useTripUpdates";
import { useState } from "react";
import { Layout } from "@/components/Layout";

export default function ViewTrip() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  
  const {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  } = useNodeManagement([]);

  const { data: trip, refetch } = useTripData(id, setNodes, setTitle);
  const tripUpdate = useTripUpdates();

  const handleSave = async () => {
    if (!id) return;
    
    await tripUpdate.mutateAsync({
      tripId: id,
      title,
      nodes
    });
    
    await refetch();
  };

  // Extract email recipients from nodes
  const emailRecipients = nodes.flatMap(node => {
    const details = node.data?.details || {};
    const names = Array.isArray(details.traveller_names) ? details.traveller_names : [];
    const emails = Array.isArray(details.emails) ? details.emails : [];
    
    return names.map((name: string, index: number) => {
      const email = emails[index];
      return typeof email === 'string' && email
        ? { name, email }
        : null;
    }).filter((recipient): recipient is { name: string; email: string } => 
      recipient !== null
    );
  });

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <TripToolbar
          title={title}
          onTitleChange={setTitle}
          onSave={handleSave}
          tripId={id}
          emailRecipients={emailRecipients}
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
}