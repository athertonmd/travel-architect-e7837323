import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";

interface FlightDetailsSectionProps {
  details: SegmentDetails;
  onDetailsChange: (field: keyof SegmentDetails, value: string | boolean) => void;
}

export function FlightDetailsSection({ details, onDetailsChange }: FlightDetailsSectionProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="departureAirport" className="text-blue-500">Departure Airport</Label>
        <Input
          id="departureAirport"
          value={details.departureAirport as string || ""}
          onChange={(e) => onDetailsChange("departureAirport", e.target.value)}
          placeholder="e.g., LAX"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="destinationAirport" className="text-blue-500">Destination Airport</Label>
        <Input
          id="destinationAirport"
          value={details.destinationAirport as string || ""}
          onChange={(e) => onDetailsChange("destinationAirport", e.target.value)}
          placeholder="e.g., JFK"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="flightNumber" className="text-blue-500">Flight Number</Label>
        <Input
          id="flightNumber"
          value={details.flightNumber as string || ""}
          onChange={(e) => onDetailsChange("flightNumber", e.target.value)}
          placeholder="e.g., AA123"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cabinClass" className="text-blue-500">Cabin Class</Label>
        <Input
          id="cabinClass"
          value={details.cabinClass as string || ""}
          onChange={(e) => onDetailsChange("cabinClass", e.target.value)}
          placeholder="e.g., Business"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="loyaltyNumber" className="text-blue-500">Loyalty Number</Label>
        <Input
          id="loyaltyNumber"
          value={details.loyaltyNumber as string || ""}
          onChange={(e) => onDetailsChange("loyaltyNumber", e.target.value)}
          placeholder="e.g., FF123456"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="seatNumber" className="text-blue-500">Seat Number</Label>
        <Input
          id="seatNumber"
          value={details.seatNumber as string || ""}
          onChange={(e) => onDetailsChange("seatNumber", e.target.value)}
          placeholder="e.g., 12A"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="meal" className="text-blue-500">Meal Preference</Label>
        <Input
          id="meal"
          value={details.meal as string || ""}
          onChange={(e) => onDetailsChange("meal", e.target.value)}
          placeholder="e.g., Vegetarian"
          className="text-gray-700"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes" className="text-blue-500">Notes</Label>
        <Input
          id="notes"
          value={details.notes as string || ""}
          onChange={(e) => onDetailsChange("notes", e.target.value)}
          placeholder="Any additional notes..."
          className="text-gray-700"
        />
      </div>
    </>
  );
}