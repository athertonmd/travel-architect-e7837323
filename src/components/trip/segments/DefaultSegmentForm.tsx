import { memo } from "react";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { TravelerSelection } from "./traveler/TravelerSelection";
import { TravelerList } from "./traveler/TravelerList";

interface DefaultSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function DefaultSegmentFormComponent({ details, onDetailsChange }: DefaultSegmentFormProps) {
  const handleTravellerSelect = (traveller: TravellersRow) => {
    console.log('Selected traveller:', traveller);
    
    // Create arrays if they don't exist
    const existingTravellerIds = Array.isArray(details.traveller_ids) ? details.traveller_ids : [];
    const existingTravellerNames = Array.isArray(details.traveller_names) ? details.traveller_names : [];
    const existingEmails = Array.isArray(details.emails) ? details.emails : [];
    const existingMobileNumbers = Array.isArray(details.mobile_numbers) ? details.mobile_numbers : [];

    // Check if traveller is already selected
    if (existingTravellerIds.includes(traveller.id)) {
      console.log('Traveller already selected');
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

  const stopPropagation = (e: React.FocusEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  const travelerCount = Array.isArray(details.traveller_names) ? details.traveller_names.length : 0;

  return (
    <div 
      className="space-y-4"
      onClick={stopPropagation}
      onFocus={stopPropagation}
    >
      <TravelerSelection 
        travelerCount={travelerCount}
        onSelect={handleTravellerSelect}
      />
      
      {Array.isArray(details.traveller_names) && details.traveller_names.length > 0 && (
        <div className="grid gap-2">
          <Label>Selected Travelers</Label>
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

export const DefaultSegmentForm = memo(DefaultSegmentFormComponent);