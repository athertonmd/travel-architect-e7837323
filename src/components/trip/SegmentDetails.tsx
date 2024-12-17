import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Node } from "@xyflow/react";

interface SegmentDetails {
  time?: string;
  location?: string;
  notes?: string;
}

type SegmentNodeData = {
  label: string;
  icon: string;
  details: SegmentDetails;
};

type SegmentDetailsProps = {
  selectedNode: (Node<SegmentNodeData> | null);
  onDetailsChange: (nodeId: string, details: SegmentDetails) => void;
};

export function SegmentDetails({ selectedNode, onDetailsChange }: SegmentDetailsProps) {
  if (!selectedNode) {
    return (
      <div className="h-full p-4 bg-white">
        <p className="text-muted-foreground">Select a segment to view and edit its details</p>
      </div>
    );
  }

  const details = selectedNode.data.details || {};

  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange(selectedNode.id, {
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="h-full p-4 bg-white">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">{selectedNode.data.icon}</span>
        <h3 className="font-semibold">{selectedNode.data.label} Details</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            value={details.time || ""}
            onChange={(e) => handleChange("time", e.target.value)}
            placeholder="e.g., 2:30 PM"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={details.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter location"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={details.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes"
          />
        </div>
      </div>
    </div>
  );
}