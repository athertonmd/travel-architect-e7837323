
import { Layout } from "@/components/Layout";
import { SegmentPalette } from "@/components/SegmentPalette";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { TripSaveButton } from "@/components/trip/TripSaveButton";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SegmentDetails } from "@/components/trip/SegmentDetails";
import { useNodeManagement } from "@/hooks/useNodeManagement";
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState as useReactState } from "react";
import { Session } from '@supabase/supabase-js';

const CreateTrip = () => {
  const [tripTitle, setTripTitle] = useState("Create New Trip");
  const [travelers, setTravelers] = useState(1);
  const [session, setSession] = useReactState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    nodes,
    selectedNode,
    handleNodesChange,
    handleNodeSelect,
    handleDetailsChange,
    setNodes
  } = useNodeManagement();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    getSession();
  }, []);

  console.log('CreateTrip: Session state:', session);
  console.log('CreateTrip: Loading state:', isLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    console.log('CreateTrip: No session, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TripTitleHeader title={tripTitle} onTitleChange={setTripTitle} />
          </div>
          <TripSaveButton title={tripTitle} nodes={nodes} travelers={travelers} />
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

export default CreateTrip;
