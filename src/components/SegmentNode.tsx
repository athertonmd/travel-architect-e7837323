import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Handle, Position } from "@xyflow/react";
import { useState } from "react";

type SegmentDetails = {
  notes?: string;
  time?: string;
  location?: string;
};

export function SegmentNode({ data, id }: { data: { label: string; icon: string; details?: SegmentDetails }; id: string }) {
  const [details, setDetails] = useState<SegmentDetails>(data.details || {});
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveDetails = () => {
    data.details = details;
    setIsOpen(false);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="min-w-40 justify-start gap-2 bg-white drag-handle cursor-move"
          >
            <span>{data.icon}</span>
            {data.label}
            {details.time && <span className="ml-2 text-sm text-muted-foreground">({details.time})</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {data.icon} {data.label} Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                value={details.time || ""}
                onChange={(e) => setDetails(prev => ({ ...prev, time: e.target.value }))}
                placeholder="e.g., 2:30 PM"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={details.location || ""}
                onChange={(e) => setDetails(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={details.notes || ""}
                onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes"
              />
            </div>
            <Button onClick={handleSaveDetails} className="mt-4">
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}