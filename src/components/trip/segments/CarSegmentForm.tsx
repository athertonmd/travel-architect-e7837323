import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SegmentDetails } from "@/types/segment";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { TravelerSelection } from "./traveler/TravelerSelection";
import { TravelerList } from "./traveler/TravelerList";

interface CarSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function CarSegmentFormComponent({ details, onDetailsChange }: CarSegmentFormProps) {
  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  const handleTravellerSelect = (traveller: TravellersRow) => {
    const existingTravellerIds = Array.isArray(details.traveller_ids) ? details.traveller_ids : [];
    const existingTravellerNames = Array.isArray(details.traveller_names) ? details.traveller_names : [];
    const existingEmails = Array.isArray(details.emails) ? details.emails : [];
    const existingMobileNumbers = Array.isArray(details.mobile_numbers) ? details.mobile_numbers : [];

    if (existingTravellerIds.includes(traveller.id)) {
      return;
    }

    onDetailsChange({
      ...details,
      traveller_ids: [...existingTravellerIds, traveller.id],
      traveller_names: [...existingTravellerNames, `${traveller.first_name} ${traveller.last_name}`],
      emails: [...existingEmails, traveller.email || ""],
      mobile_numbers: [...existingMobileNumbers, traveller.mobile_number || ""],
    });
  };

  const removeTraveller = (index: number) => {
    const traveller_ids = Array.isArray(details.traveller_ids) ? [...details.traveller_ids] : [];
    const traveller_names = Array.isArray(details.traveller_names) ? [...details.traveller_names] : [];
    const emails = Array.isArray(details.emails) ? [...details.emails] : [];
    const mobile_numbers = Array.isArray(details.mobile_numbers) ? [...details.mobile_numbers] : [];

    traveller_ids.splice(index, 1);
    traveller_names.splice(index, 1);
    emails.splice(index, 1);
    mobile_numbers.splice(index, 1);

    onDetailsChange({
      ...details,
      traveller_ids,
      traveller_names,
      emails,
      mobile_numbers,
    });
  };

  const travelerCount = Array.isArray(details.traveller_names) ? details.traveller_names.length : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label className="text-blue-500">Pick up date</Label>
          <Input
            type="date"
            value={details.pickupDate as string || ""}
            onChange={(e) => handleInputChange("pickupDate", e.target.value)}
            className="text-gray-700"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-blue-500">Drop off date</Label>
          <Input
            type="date"
            value={details.dropoffDate as string || ""}
            onChange={(e) => handleInputChange("dropoffDate", e.target.value)}
            className="text-gray-700"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-blue-500">Rental Location</Label>
          <Input
            type="text"
            value={details.rentalLocation as string || ""}
            onChange={(e) => handleInputChange("rentalLocation", e.target.value)}
            className="text-gray-700"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-blue-500">Return Location</Label>
          <Input
            type="text"
            value={details.returnLocation as string || ""}
            onChange={(e) => handleInputChange("returnLocation", e.target.value)}
            className="text-gray-700"
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-blue-500">Type</Label>
          <Input
            type="text"
            value={details.carType as string || ""}
            onChange={(e) => handleInputChange("carType", e.target.value)}
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

      <TravelerSelection 
        travelerCount={travelerCount}
        onSelect={handleTravellerSelect}
      />
      
      {Array.isArray(details.traveller_names) && details.traveller_names.length > 0 && (
        <div className="grid gap-2">
          <Label className="text-blue-500">Selected Travelers</Label>
          <TravelerList
            travelerNames={details.traveller_names as string[]}
            emails={details.emails as string[]}
            mobileNumbers={details.mobile_numbers as string[]}
            onRemove={removeTraveller}
          />
        </div>
      )}
    </div>
  );
}

export const CarSegmentForm = memo(CarSegmentFormComponent);