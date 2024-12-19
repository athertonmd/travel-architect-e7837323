import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface FlightDetailsSectionProps {
  details: SegmentDetails;
  onDetailsChange: (field: keyof SegmentDetails, value: string) => void;
}

export function FlightDetailsSection({ details, onDetailsChange }: FlightDetailsSectionProps) {
  return (
    <>
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
        <Label htmlFor="flightNumber">Flight Number</Label>
        <Input
          id="flightNumber"
          value={details.flightNumber as string || ""}
          onChange={(e) => onDetailsChange("flightNumber", e.target.value)}
          placeholder="e.g., AA123"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cabinClass">Cabin Class</Label>
        <Input
          id="cabinClass"
          value={details.cabinClass as string || ""}
          onChange={(e) => onDetailsChange("cabinClass", e.target.value)}
          placeholder="e.g., Business"
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

      <div className="grid gap-2">
        <Label htmlFor="seatNumber">Seat Number</Label>
        <Input
          id="seatNumber"
          value={details.seatNumber as string || ""}
          onChange={(e) => onDetailsChange("seatNumber", e.target.value)}
          placeholder="e.g., 12A"
        />
      </div>
    </>
  );
}