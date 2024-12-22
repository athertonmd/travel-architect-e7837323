import { Label } from "@/components/ui/label";
import { TravellerSelect } from "@/components/travellers/TravellerSelect";
import { TravellersRow } from "@/integrations/supabase/types/travellers";

interface TravelerSelectionProps {
  travelerCount: number;
  onSelect: (traveller: TravellersRow) => void;
}

export function TravelerSelection({ travelerCount, onSelect }: TravelerSelectionProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-blue-500">Add Travelers ({travelerCount} {travelerCount === 1 ? 'traveler' : 'travelers'})</Label>
      <TravellerSelect onSelect={onSelect} />
    </div>
  );
}