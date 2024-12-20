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
        <Label>Traveller</Label>
        <TravellerSelect onSelect={handleTravellerSelect} />
      </div>
      {details.traveller_name && (
        <div className="grid gap-2">
          <Label>Selected Traveller</Label>
          <div className="text-sm text-muted-foreground">
            <div>{details.traveller_name as string}</div>
            {details.email && <div>Email: {details.email as string}</div>}
            {details.mobile_number && <div>Mobile: {details.mobile_number as string}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export const DefaultSegmentForm = memo(DefaultSegmentFormComponent);