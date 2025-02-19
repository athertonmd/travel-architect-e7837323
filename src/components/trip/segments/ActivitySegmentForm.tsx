
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SegmentDetails } from "@/types/segment";

interface ActivitySegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function ActivitySegmentForm({ details, onDetailsChange }: ActivitySegmentFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label className="text-blue-500">Activity Provider</Label>
        <Input
          value={details.activityProvider as string || ""}
          onChange={(e) => handleInputChange("activityProvider", e.target.value)}
          placeholder="Enter activity provider"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Date and Time</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.activityDate as string || ""}
            onChange={(e) => handleInputChange("activityDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.activityTime as string || ""}
            onChange={(e) => handleInputChange("activityTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Contact Name</Label>
        <Input
          value={details.contactName as string || ""}
          onChange={(e) => handleInputChange("contactName", e.target.value)}
          placeholder="Enter contact name"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Location</Label>
        <Input
          value={details.location as string || ""}
          onChange={(e) => handleInputChange("location", e.target.value)}
          placeholder="Enter location"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Duration</Label>
        <Input
          value={details.duration as string || ""}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          placeholder="Enter duration (e.g., 2 hours)"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Notes</Label>
        <Textarea
          value={details.notes as string || ""}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Enter any additional notes"
          className="text-gray-700 min-h-[100px]"
        />
      </div>
    </div>
  );
}
