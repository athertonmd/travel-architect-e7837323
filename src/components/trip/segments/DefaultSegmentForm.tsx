import { SegmentDetails } from "@/types/segment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TravellerSegment } from "./TravellerSegment";

interface DefaultSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function DefaultSegmentForm({ details, onDetailsChange }: DefaultSegmentFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      {details.type === "traveller" ? (
        <TravellerSegment />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={details.time || ""}
              onChange={(e) => handleInputChange("time", e.target.value)}
              placeholder="Enter time"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={details.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={details.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter notes"
            />
          </div>
        </>
      )}
    </div>
  );
}