import { SegmentDetails } from "@/types/segment";
import { FlightDateSection } from "./flight/FlightDateSection";
import { FlightDetailsSection } from "./flight/FlightDetailsSection";
import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface FlightSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function FlightSegmentFormComponent({ details, onDetailsChange }: FlightSegmentFormProps) {
  const handleChange = (field: keyof SegmentDetails, value: string | boolean) => {
    const updatedDetails = {
      ...details,
      [field]: value,
    };
    console.log('Updating flight details:', updatedDetails);
    onDetailsChange(updatedDetails);
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
      <div className="flex items-center space-x-2 mb-4">
        <Label htmlFor="gds-mode" className="text-blue-500">GDS</Label>
        <Switch
          id="gds-mode"
          checked={details.gdsEnabled as boolean}
          onCheckedChange={(checked) => handleChange("gdsEnabled", checked)}
        />
      </div>

      {details.gdsEnabled && (
        <div className="grid gap-2 mb-4">
          <Label htmlFor="recordLocator" className="text-blue-500">Find Record Locator</Label>
          <Input
            id="recordLocator"
            value={details.recordLocator as string || ""}
            onChange={(e) => handleChange("recordLocator", e.target.value)}
            placeholder="Enter record locator"
          />
        </div>
      )}

      <FlightDateSection 
        details={details} 
        onDetailsChange={handleChange}
      />
      <FlightDetailsSection 
        details={details} 
        onDetailsChange={handleChange}
      />
    </div>
  );
}

export const FlightSegmentForm = memo(FlightSegmentFormComponent);