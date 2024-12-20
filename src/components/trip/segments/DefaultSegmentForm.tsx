import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { TravellerSelect } from "@/components/travellers/TravellerSelect";
import { memo } from "react";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      
      {Array.isArray(details.traveller_names) && details.traveller_names.length > 0 && (
        <div className="grid gap-2">
          <Label>Selected Travellers</Label>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {details.traveller_names.map((name, index) => (
                <div key={index} className="flex items-start justify-between space-x-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">{name}</p>
                    {details.emails?.[index] && (
                      <p className="text-muted-foreground">Email: {details.emails[index]}</p>
                    )}
                    {details.mobile_numbers?.[index] && (
                      <p className="text-muted-foreground">Mobile: {details.mobile_numbers[index]}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeTraveller(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

export const DefaultSegmentForm = memo(DefaultSegmentFormComponent);