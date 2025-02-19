
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SegmentDetails } from "@/types/segment";

interface RestaurantSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function RestaurantSegmentForm({ details, onDetailsChange }: RestaurantSegmentFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label className="text-blue-500">Restaurant Name</Label>
        <Input
          value={details.restaurantName as string || ""}
          onChange={(e) => handleInputChange("restaurantName", e.target.value)}
          placeholder="Enter restaurant name"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Date and Time of Booking</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={details.bookingDate as string || ""}
            onChange={(e) => handleInputChange("bookingDate", e.target.value)}
            className="text-gray-700"
          />
          <Input
            type="time"
            value={details.bookingTime as string || ""}
            onChange={(e) => handleInputChange("bookingTime", e.target.value)}
            className="text-gray-700"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Address Line 1</Label>
        <Input
          value={details.addressLine1 as string || ""}
          onChange={(e) => handleInputChange("addressLine1", e.target.value)}
          placeholder="Enter address line 1"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Address Line 2</Label>
        <Input
          value={details.addressLine2 as string || ""}
          onChange={(e) => handleInputChange("addressLine2", e.target.value)}
          placeholder="Enter address line 2"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">City</Label>
        <Input
          value={details.city as string || ""}
          onChange={(e) => handleInputChange("city", e.target.value)}
          placeholder="Enter city"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">State</Label>
        <Input
          value={details.state as string || ""}
          onChange={(e) => handleInputChange("state", e.target.value)}
          placeholder="Enter state"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Zip/Postcode</Label>
        <Input
          value={details.zipCode as string || ""}
          onChange={(e) => handleInputChange("zipCode", e.target.value)}
          placeholder="Enter zip/postcode"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Booking Reference</Label>
        <Input
          value={details.bookingReference as string || ""}
          onChange={(e) => handleInputChange("bookingReference", e.target.value)}
          placeholder="Enter booking reference"
          className="text-gray-700"
        />
      </div>
    </div>
  );
}
