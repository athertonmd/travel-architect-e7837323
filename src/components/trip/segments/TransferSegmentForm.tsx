import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface TransferSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function TransferSegmentForm({ details, onDetailsChange }: TransferSegmentFormProps) {
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
          placeholder="Enter transfer provider"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Transfer From</Label>
        <Input
          type="text"
          value={details.transferFrom as string || ""}
          onChange={(e) => handleInputChange("transferFrom", e.target.value)}
          className="text-gray-700"
          placeholder="Enter starting location"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Transfer To</Label>
        <Input
          type="text"
          value={details.transferTo as string || ""}
          onChange={(e) => handleInputChange("transferTo", e.target.value)}
          className="text-gray-700"
          placeholder="Enter destination"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Pick Up Location</Label>
        <Input
          type="text"
          value={details.pickupLocation as string || ""}
          onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
          className="text-gray-700"
          placeholder="Enter pick up location"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Date and Time</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.transferDate as string || ""}
            onChange={(e) => handleInputChange("transferDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.transferTime as string || ""}
            onChange={(e) => handleInputChange("transferTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Confirmation Number</Label>
        <Input
          type="text"
          value={details.confirmationNumber as string || ""}
          onChange={(e) => handleInputChange("confirmationNumber", e.target.value)}
          className="text-gray-700"
          placeholder="Enter confirmation number"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Notes</Label>
        <Input
          type="text"
          value={details.notes as string || ""}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className="text-gray-700"
          placeholder="Add any additional notes"
        />
      </div>
    </div>
  );
}