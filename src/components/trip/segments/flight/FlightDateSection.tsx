import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { SegmentDetails } from "@/types/segment";

interface FlightDateSectionProps {
  details: SegmentDetails;
  onDetailsChange: (field: keyof SegmentDetails, value: string | boolean) => void;
}

export function FlightDateSection({ details, onDetailsChange }: FlightDateSectionProps) {
  const today = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const handleDateChange = (field: keyof SegmentDetails, value: string) => {
    console.log('Date changed:', field, value);
    onDetailsChange(field, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="departureDate">Departure Date</Label>
        <Input
          id="departureDate"
          type="datetime-local"
          min={today}
          value={details.departureDate || ""}
          onChange={(e) => handleDateChange("departureDate", e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="departureAirport">Departure Airport</Label>
        <Input
          id="departureAirport"
          value={details.departureAirport as string || ""}
          onChange={(e) => onDetailsChange("departureAirport", e.target.value)}
          placeholder="e.g., LAX"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="destinationAirport">Destination Airport</Label>
        <Input
          id="destinationAirport"
          value={details.destinationAirport as string || ""}
          onChange={(e) => onDetailsChange("destinationAirport", e.target.value)}
          placeholder="e.g., JFK"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="loyaltyNumber">Loyalty Number</Label>
        <Input
          id="loyaltyNumber"
          value={details.loyaltyNumber as string || ""}
          onChange={(e) => onDetailsChange("loyaltyNumber", e.target.value)}
          placeholder="e.g., FF123456"
        />
      </div>
    </>
  );
}