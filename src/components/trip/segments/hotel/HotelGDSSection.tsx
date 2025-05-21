
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SegmentDetails } from "@/types/segment";

interface HotelGDSSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelGDSSection({ details, onDetailsChange }: HotelGDSSectionProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label htmlFor="gdsProvider" className="text-blue-500">GDS Provider</Label>
        <Input
          id="gdsProvider"
          value={details.gdsProvider as string || ""}
          onChange={(e) => handleChange("gdsProvider", e.target.value)}
          placeholder="Enter GDS provider"
          className="text-gray-700 bg-white border border-gray-200"
        />
      </div>

      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label htmlFor="gdsReference" className="text-blue-500">GDS Reference</Label>
        <Input
          id="gdsReference"
          value={details.gdsReference as string || ""}
          onChange={(e) => handleChange("gdsReference", e.target.value)}
          placeholder="Enter GDS reference"
          className="text-gray-700 bg-white border border-gray-200"
        />
      </div>
    </div>
  );
}
