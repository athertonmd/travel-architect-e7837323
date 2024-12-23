import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SegmentDetails } from "@/types/segment";

interface FlightDetailsSectionProps {
  details: SegmentDetails;
  onDetailsChange: (field: keyof SegmentDetails, value: string | boolean) => void;
}

export function FlightDetailsSection({ details, onDetailsChange }: FlightDetailsSectionProps) {
  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="gds-mode"
          checked={details.gdsEnabled as boolean}
          onCheckedChange={(checked) => onDetailsChange("gdsEnabled", checked)}
        />
        <Label htmlFor="gds-mode" className="text-blue-500">GDS</Label>
      </div>

      {details.gdsEnabled && (
        <div className="grid gap-2 mb-4">
          <Label htmlFor="recordLocator" className="text-blue-500">Find Record Locator</Label>
          <Input
            id="recordLocator"
            value={details.recordLocator as string || ""}
            onChange={(e) => onDetailsChange("recordLocator", e.target.value)}
            placeholder="Enter record locator"
            className="text-gray-700"
          />
        </div>
      )}

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
    </>
  );
}