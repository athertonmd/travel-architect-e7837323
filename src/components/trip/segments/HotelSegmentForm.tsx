import { SegmentDetails } from "@/types/segment";
import { memo } from "react";
import { HotelGDSSection } from "./hotel/HotelGDSSection";
import { HotelBasicInfoSection } from "./hotel/HotelBasicInfoSection";
import { HotelContactSection } from "./hotel/HotelContactSection";
import { HotelDatesSection } from "./hotel/HotelDatesSection";
import { HotelAdditionalInfoSection } from "./hotel/HotelAdditionalInfoSection";

interface HotelSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

function HotelSegmentFormComponent({ details, onDetailsChange }: HotelSegmentFormProps) {
  const stopPropagation = (e: React.FocusEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="space-y-4"
      onClick={stopPropagation}
      onFocus={stopPropagation}
    >
      <HotelGDSSection details={details} onDetailsChange={onDetailsChange} />
      <HotelBasicInfoSection details={details} onDetailsChange={onDetailsChange} />
      <HotelContactSection details={details} onDetailsChange={onDetailsChange} />
      <HotelDatesSection details={details} onDetailsChange={onDetailsChange} />
      <HotelAdditionalInfoSection details={details} onDetailsChange={onDetailsChange} />
    </div>
  );
}

export const HotelSegmentForm = memo(HotelSegmentFormComponent);