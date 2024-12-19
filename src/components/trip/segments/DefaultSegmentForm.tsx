import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { memo } from "react";

interface DefaultSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function DefaultSegmentFormComponent({ details, onDetailsChange }: DefaultSegmentFormProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange({ ...details, [field]: value });
  };

  const stopPropagation = (e: React.FocusEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="space-y-4"
      onClick={stopPropagation}
      onFocus={stopPropagation}
    >
      <div className="grid gap-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          value={details.time || ""}
          onChange={(e) => handleChange("time", e.target.value)}
          placeholder="e.g., 2:30 PM"
          onFocus={stopPropagation}
          onClick={stopPropagation}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={details.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Enter location"
          onFocus={stopPropagation}
          onClick={stopPropagation}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={details.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any additional notes"
          onFocus={stopPropagation}
          onClick={stopPropagation}
        />
      </div>
    </div>
  );
}

export const DefaultSegmentForm = memo(DefaultSegmentFormComponent);