import { Layout } from "@/components/Layout";
import { SegmentPalette } from "@/components/SegmentPalette";
import { useState } from "react";
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { FlowEditor } from "@/components/trip/FlowEditor";
import { TripSaveButton } from "@/components/trip/TripSaveButton";

const CreateTrip = () => {
  const [tripTitle, setTripTitle] = useState("Create New Trip");

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <TripTitleHeader title={tripTitle} onTitleChange={setTripTitle} />
          <TripSaveButton title={tripTitle} nodes={[]} />
        </div>

        <div className="flex gap-8">
          <SegmentPalette />
          <FlowEditor />
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;