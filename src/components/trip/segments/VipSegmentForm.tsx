
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SegmentDetails } from "@/types/segment";

interface VipSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function VipSegmentForm({ details, onDetailsChange }: VipSegmentFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label className="text-blue-500">Service Provider</Label>
        <Input
          type="text"
          value={details.serviceProvider as string || ""}
          onChange={(e) => handleInputChange("serviceProvider", e.target.value)}
          className="text-gray-700"
          placeholder="Enter service provider name"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Location</Label>
        <Input
          type="text"
          value={details.location as string || ""}
          onChange={(e) => handleInputChange("location", e.target.value)}
          className="text-gray-700"
          placeholder="Enter location"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Start Date & Time</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.startDate as string || ""}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.startTime as string || ""}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">End Date & Time</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.endDate as string || ""}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.endTime as string || ""}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Reference Number</Label>
        <Input
          type="text"
          value={details.referenceNumber as string || ""}
          onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
          className="text-gray-700"
          placeholder="Enter reference number"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Contact Details</Label>
        <Input
          type="text"
          value={details.contactDetails as string || ""}
          onChange={(e) => handleInputChange("contactDetails", e.target.value)}
          className="text-gray-700"
          placeholder="Enter contact details"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Comments</Label>
        <Textarea
          value={details.comments as string || ""}
          onChange={(e) => handleInputChange("comments", e.target.value)}
          className="text-gray-700 min-h-[100px]"
          placeholder="Enter any additional comments"
        />
      </div>
    </div>
  );
}
