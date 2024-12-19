import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Node } from "@xyflow/react";
import { FlightSegmentForm } from "./segments/FlightSegmentForm";
import { SegmentDetails as ISegmentDetails, SegmentNodeData } from "@/types/segment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type SegmentDetailsProps = {
  selectedNode: Node<SegmentNodeData> | null;
  onDetailsChange: (nodeId: string, details: ISegmentDetails) => void;
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

  const handleDetailsChange = (newDetails: ISegmentDetails) => {
    console.log('Details changing:', newDetails);
    onDetailsChange(selectedNode.id, newDetails);
  };

  const handleSave = () => {
    toast.success("Segment details saved successfully!");
  };

  const handleDelete = () => {
    // The actual deletion is handled by React Flow's built-in functionality
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    document.dispatchEvent(event);
    toast.success("Segment deleted successfully!");
  };

  const renderSegmentForm = () => {
    switch (selectedNode.data.label.toLowerCase()) {
      case "flight":
        return <FlightSegmentForm details={details} onDetailsChange={handleDetailsChange} />;
      default:
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={details.time || ""}
                onChange={(e) => handleDetailsChange({ ...details, time: e.target.value })}
                placeholder="e.g., 2:30 PM"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={details.location || ""}
                onChange={(e) => handleDetailsChange({ ...details, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={details.notes || ""}
                onChange={(e) => handleDetailsChange({ ...details, notes: e.target.value })}
                placeholder="Add any additional notes"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedNode.data.icon}</span>
          <h3 className="font-semibold">{selectedNode.data.label} Details</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {renderSegmentForm()}

      <div className="mt-6">
        <Button onClick={handleSave} className="w-full">
          Save Details
        </Button>
      </div>
    </div>
  );
}