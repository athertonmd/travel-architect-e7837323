import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface HotelBasicInfoSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelBasicInfoSection({ details, onDetailsChange }: HotelBasicInfoSectionProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
    onDetailsChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="hotelName" className="text-blue-500">Hotel Name</Label>
        <Input
          id="hotelName"
          value={details.hotelName as string || ""}
          onChange={(e) => handleChange("hotelName", e.target.value)}
          placeholder="Enter hotel name"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine1" className="text-blue-500">Hotel Address (Line 1)</Label>
        <Input
          id="addressLine1"
          value={details.addressLine1 as string || ""}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          placeholder="Enter address line 1"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine2" className="text-blue-500">Hotel Address (Line 2)</Label>
        <Input
          id="addressLine2"
          value={details.addressLine2 as string || ""}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          placeholder="Enter address line 2"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="stateProvince" className="text-blue-500">State/Province</Label>
        <Input
          id="stateProvince"
          value={details.stateProvince as string || ""}
          onChange={(e) => handleChange("stateProvince", e.target.value)}
          placeholder="Enter state or province"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="country" className="text-blue-500">Country</Label>
        <Input
          id="country"
          value={details.country as string || ""}
          onChange={(e) => handleChange("country", e.target.value)}
          placeholder="Enter country"
          className="text-gray-700"
        />
      </div>
    </div>
  );
}