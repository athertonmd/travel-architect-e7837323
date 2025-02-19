
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface LimoSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function LimoSegmentForm({ details, onDetailsChange }: LimoSegmentFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label className="text-blue-500">Provider</Label>
        <Input
          type="text"
          value={details.provider as string || ""}
          onChange={(e) => handleInputChange("provider", e.target.value)}
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Location</Label>
        <Input
          type="text"
          value={details.location as string || ""}
          onChange={(e) => handleInputChange("location", e.target.value)}
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Pick Up</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.pickupDate as string || ""}
            onChange={(e) => handleInputChange("pickupDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.pickupTime as string || ""}
            onChange={(e) => handleInputChange("pickupTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Expected Drop Off</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.dropoffDate as string || ""}
            onChange={(e) => handleInputChange("dropoffDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.dropoffTime as string || ""}
            onChange={(e) => handleInputChange("dropoffTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Driver</Label>
        <Input
          type="text"
          value={details.driver as string || ""}
          onChange={(e) => handleInputChange("driver", e.target.value)}
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Confirmation Number</Label>
        <Input
          type="text"
          value={details.confirmationNumber as string || ""}
          onChange={(e) => handleInputChange("confirmationNumber", e.target.value)}
          className="text-gray-700"
        />
      </div>
    </div>
  );
}
