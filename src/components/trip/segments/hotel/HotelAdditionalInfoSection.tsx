
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface HotelAdditionalInfoSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelAdditionalInfoSection({ details, onDetailsChange }: HotelAdditionalInfoSectionProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label htmlFor="reference" className="text-blue-500">Reference</Label>
        <Input
          id="reference"
          value={details.reference as string || ""}
          onChange={(e) => handleChange("reference", e.target.value)}
          placeholder="Enter booking reference"
          className="text-gray-700 bg-white border border-gray-200"
        />
      </div>

      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label htmlFor="notes" className="text-blue-500">Notes</Label>
        <Input
          id="notes"
          value={details.notes as string || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any additional notes"
          className="text-gray-700 bg-white border border-gray-200"
        />
      </div>
    </div>
  );
}
