import { SegmentDetails } from "@/types/segment";
import { FlightDateSection } from "./flight/FlightDateSection";
import { FlightDetailsSection } from "./flight/FlightDetailsSection";

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

  return (
    <div className="space-y-4">
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