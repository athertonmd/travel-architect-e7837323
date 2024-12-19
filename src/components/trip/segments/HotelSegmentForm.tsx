import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { memo } from "react";

interface HotelSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function HotelSegmentFormComponent({ details, onDetailsChange }: HotelSegmentFormProps) {
  const handleChange = (field: keyof SegmentDetails, value: string) => {
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
      <div className="grid gap-2">
        <Label htmlFor="hotelName">Hotel Name</Label>
        <Input
          id="hotelName"
          value={details.hotelName as string || ""}
          onChange={(e) => handleChange("hotelName", e.target.value)}
          placeholder="Enter hotel name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine1">Hotel Address (Line 1)</Label>
        <Input
          id="addressLine1"
          value={details.addressLine1 as string || ""}
          onChange={(e) => handleChange("addressLine1", e.target.value)}
          placeholder="Enter address line 1"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="addressLine2">Hotel Address (Line 2)</Label>
        <Input
          id="addressLine2"
          value={details.addressLine2 as string || ""}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          placeholder="Enter address line 2"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="stateProvince">State/Province</Label>
        <Input
          id="stateProvince"
          value={details.stateProvince as string || ""}
          onChange={(e) => handleChange("stateProvince", e.target.value)}
          placeholder="Enter state or province"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={details.country as string || ""}
          onChange={(e) => handleChange("country", e.target.value)}
          placeholder="Enter country"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="telephone">Telephone Number</Label>
        <Input
          id="telephone"
          value={details.telephone as string || ""}
          onChange={(e) => handleChange("telephone", e.target.value)}
          placeholder="Enter telephone number"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkInDate">Check-in Date</Label>
        <Input
          id="checkInDate"
          type="date"
          value={details.checkInDate as string || ""}
          onChange={(e) => handleChange("checkInDate", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkInTime">Check-in Time</Label>
        <Input
          id="checkInTime"
          type="time"
          value={details.checkInTime as string || ""}
          onChange={(e) => handleChange("checkInTime", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkOutDate">Check-out Date</Label>
        <Input
          id="checkOutDate"
          type="date"
          value={details.checkOutDate as string || ""}
          onChange={(e) => handleChange("checkOutDate", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkOutTime">Check-out Time</Label>
        <Input
          id="checkOutTime"
          type="time"
          value={details.checkOutTime as string || ""}
          onChange={(e) => handleChange("checkOutTime", e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reference">Reference</Label>
        <Input
          id="reference"
          value={details.reference as string || ""}
          onChange={(e) => handleChange("reference", e.target.value)}
          placeholder="Enter booking reference"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={details.notes as string || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any additional notes"
        />
      </div>
    </div>
  );
}

export const HotelSegmentForm = memo(HotelSegmentFormComponent);