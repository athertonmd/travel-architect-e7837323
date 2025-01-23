import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface HotelDatesSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelDatesSection({ details, onDetailsChange }: HotelDatesSectionProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="checkInDate" className="text-blue-500">Check-in Date</Label>
        <Input
          id="checkInDate"
          type="date"
          value={details.checkInDate as string || ""}
          onChange={(e) => handleChange("checkInDate", e.target.value)}
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkInTime" className="text-blue-500">Check-in Time</Label>
        <Input
          id="checkInTime"
          type="time"
          value={details.checkInTime as string || ""}
          onChange={(e) => handleChange("checkInTime", e.target.value)}
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkOutDate" className="text-blue-500">Check-out Date</Label>
        <Input
          id="checkOutDate"
          type="date"
          value={details.checkOutDate as string || ""}
          onChange={(e) => handleChange("checkOutDate", e.target.value)}
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkOutTime" className="text-blue-500">Check-out Time</Label>
        <Input
          id="checkOutTime"
          type="time"
          value={details.checkOutTime as string || ""}
          onChange={(e) => handleChange("checkOutTime", e.target.value)}
          className="text-gray-700"
        />
      </div>
    </div>
  );
}