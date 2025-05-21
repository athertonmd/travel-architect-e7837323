
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface HotelContactSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelContactSection({ details, onDetailsChange }: HotelContactSectionProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label htmlFor="telephone" className="text-blue-500">Telephone Number</Label>
        <Input
          id="telephone"
          value={details.telephone as string || ""}
          onChange={(e) => handleChange("telephone", e.target.value)}
          placeholder="Enter telephone number"
          className="text-gray-700 bg-white border border-gray-200"
        />
      </div>
    </div>
  );
}
