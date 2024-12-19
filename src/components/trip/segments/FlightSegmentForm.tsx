import { SegmentDetails } from "@/types/segment";
import { FlightDateSection } from "./flight/FlightDateSection";
import { FlightDetailsSection } from "./flight/FlightDetailsSection";
import { memo } from "react";

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