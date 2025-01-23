import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SegmentDetails } from "@/types/segment";
import { memo } from "react";

interface HotelSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function HotelSegmentFormComponent({ details, onDetailsChange }: HotelSegmentFormProps) {
  const handleChange = (field: keyof SegmentDetails, value: string | boolean) => {
    onDetailsChange({ ...details, [field]: value });
  };

  const stopPropagation = (e: React.FocusEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="space-y-4"
      onClick={stopPropagation}
      onFocus={stopPropagation}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="gds-mode" className="text-blue-500">GDS</Label>
          <Switch
            id="gds-mode"
            checked={details.gdsEnabled as boolean}
            onCheckedChange={(checked) => handleChange("gdsEnabled", checked)}
          />
        </div>
        <Button
          variant="outline"
          disabled={details.gdsEnabled as boolean}
          onClick={(e) => {
            e.preventDefault();
            // Hotel bank functionality would go here
            console.log('Opening hotel bank');
          }}
        >
          Hotel Bank
        </Button>
      </div>

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

      <div className="grid gap-2">
        <Label htmlFor="telephone" className="text-blue-500">Telephone Number</Label>
        <Input
          id="telephone"
          value={details.telephone as string || ""}
          onChange={(e) => handleChange("telephone", e.target.value)}
          placeholder="Enter telephone number"
          className="text-gray-700"
        />
      </div>

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

      <div className="grid gap-2">
        <Label htmlFor="reference" className="text-blue-500">Reference</Label>
        <Input
          id="reference"
          value={details.reference as string || ""}
          onChange={(e) => handleChange("reference", e.target.value)}
          placeholder="Enter booking reference"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes" className="text-blue-500">Notes</Label>
        <Input
          id="notes"
          value={details.notes as string || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any additional notes"
          className="text-gray-700"
        />
      </div>
    </div>
  );
}

export const HotelSegmentForm = memo(HotelSegmentFormComponent);