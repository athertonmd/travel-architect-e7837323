import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SegmentDetails } from "@/types/segment";
import { format } from "date-fns";

interface FlightSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function FlightSegmentForm({ details, onDetailsChange }: FlightSegmentFormProps) {
  const handleChange = (field: keyof SegmentDetails, value: string | boolean) => {
    const updatedDetails = {
      ...details,
      [field]: value,
    };
    console.log('Updating flight details:', updatedDetails);
    onDetailsChange(updatedDetails);
  };

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="departureDate">Departure Date</Label>
        <Input
          id="departureDate"
          type="datetime-local"
          min={today}
          value={details.departureDate || ""}
          onChange={(e) => handleChange("departureDate", e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOneWay"
          checked={details.isOneWay as boolean || false}
          onCheckedChange={(checked) => handleChange("isOneWay", checked as boolean)}
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
            onChange={(e) => handleChange("returnDate", e.target.value)}
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="departureAirport">Departure Airport</Label>
        <Input
          id="departureAirport"
          value={details.departureAirport as string || ""}
          onChange={(e) => handleChange("departureAirport", e.target.value)}
          placeholder="e.g., LAX"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="destinationAirport">Destination Airport</Label>
        <Input
          id="destinationAirport"
          value={details.destinationAirport as string || ""}
          onChange={(e) => handleChange("destinationAirport", e.target.value)}
          placeholder="e.g., JFK"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="flightNumber">Flight Number</Label>
        <Input
          id="flightNumber"
          value={details.flightNumber as string || ""}
          onChange={(e) => handleChange("flightNumber", e.target.value)}
          placeholder="e.g., AA123"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cabinClass">Cabin Class</Label>
        <Input
          id="cabinClass"
          value={details.cabinClass as string || ""}
          onChange={(e) => handleChange("cabinClass", e.target.value)}
          placeholder="e.g., Business"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="seatNumber">Seat Number</Label>
        <Input
          id="seatNumber"
          value={details.seatNumber as string || ""}
          onChange={(e) => handleChange("seatNumber", e.target.value)}
          placeholder="e.g., 12A"
        />
      </div>
    </div>
  );
}