import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { TravellerSelect } from "@/components/travellers/TravellerSelect";
import { memo } from "react";
import { TravellersRow } from "@/integrations/supabase/types/travellers";

interface DefaultSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function DefaultSegmentFormComponent({ details, onDetailsChange }: DefaultSegmentFormProps) {
  const handleTravellerSelect = (traveller: TravellersRow) => {
    console.log('Selected traveller:', traveller);
    onDetailsChange({
      ...details,
      traveller_id: traveller.id,
      traveller_name: `${traveller.first_name} ${traveller.last_name}`,
      email: traveller.email || "",
      mobile_number: traveller.mobile_number || "",
    });
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
        <Label>Search Traveller</Label>
        <TravellerSelect onSelect={handleTravellerSelect} />
      </div>
      {details.traveller_name && (
        <div className="grid gap-2">
          <Label>Selected Traveller</Label>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>{String(details.traveller_name)}</div>
            {details.email && <div>Email: {String(details.email)}</div>}
            {details.mobile_number && <div>Mobile: {String(details.mobile_number)}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export const DefaultSegmentForm = memo(DefaultSegmentFormComponent);