import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOneWay"
          checked={details.isOneWay as boolean || false}
          onCheckedChange={(checked) => onDetailsChange("isOneWay", checked as boolean)}
        />
        <Label htmlFor="isOneWay">One Way Flight</Label>
      </div>

      {!details.isOneWay && (
        <div className="grid gap-2">
          <Label htmlFor="returnDate">Return Date</Label>
          <Input
            id="returnDate"
            type="datetime-local"
            min={details.departureDate as string || today}
            value={details.returnDate || ""}
            onChange={(e) => handleDateChange("returnDate", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </>
  );
}