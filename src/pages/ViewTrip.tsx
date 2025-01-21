import { useParams } from "react-router-dom";
import { TripToolbar } from "@/components/trip/TripToolbar";
import { TripContent } from "@/components/trip/TripContent";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { useTripData } from "@/hooks/useTripData";
import { useTripUpdates } from "@/hooks/useTripUpdates";
import { useState } from "react";
import { JsonValue } from "@/types/segment";

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

  // Extract email recipients from nodes, safely handling undefined values and ensuring string types
  const emailRecipients = nodes.flatMap(node => {
    const details = node.data?.details || {};
    const names = Array.isArray(details.traveller_names) ? details.traveller_names : [];
    const emails = Array.isArray(details.emails) ? details.emails : [];
    
    return names.map((name: string, index: number) => {
      const email = emails[index];
      // Only include if email is a string and not empty
      return typeof email === 'string' && email
        ? { name, email }
        : null;
    }).filter((recipient): recipient is { name: string; email: string } => 
      recipient !== null
    );
  });

  return (
    <div className="space-y-8">
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
  );
}