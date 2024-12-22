import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentDetails } from "@/types/segment";
import { FlightSegmentForm } from "./FlightSegmentForm";
import { DefaultSegmentForm } from "./DefaultSegmentForm";
import { HotelSegmentForm } from "./HotelSegmentForm";
import { CarSegmentForm } from "./CarSegmentForm";
import { LimoSegmentForm } from "./LimoSegmentForm";
import { memo } from "react";

const areDetailsEqual = (
  prevProps: { details: SegmentDetails; onDetailsChange: any }, 
  nextProps: { details: SegmentDetails; onDetailsChange: any }
) => {
  return JSON.stringify(prevProps.details) === JSON.stringify(nextProps.details);
};

const MemoizedFlightForm = memo(({ details, onDetailsChange }: { 
  details: SegmentDetails; 
  onDetailsChange: (details: SegmentDetails) => void;
}) => (
  <FlightSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedFlightForm.displayName = 'MemoizedFlightForm';

const MemoizedHotelForm = memo(({ details, onDetailsChange }: {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}) => (
  <HotelSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedHotelForm.displayName = 'MemoizedHotelForm';

const MemoizedCarForm = memo(({ details, onDetailsChange }: {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}) => (
  <CarSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedCarForm.displayName = 'MemoizedCarForm';

const MemoizedDefaultForm = memo(({ details, onDetailsChange }: {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}) => (
  <DefaultSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedDefaultForm.displayName = 'MemoizedDefaultForm';

const MemoizedLimoForm = memo(({ details, onDetailsChange }: {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}) => (
  <LimoSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedLimoForm.displayName = 'MemoizedLimoForm';

interface SegmentFormSelectorProps {
  selectedNode: Node<SegmentNodeData>;
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
  onInteraction: (e: React.MouseEvent | React.FocusEvent) => void;
}

export function SegmentFormSelector({ 
  selectedNode, 
  details, 
  onDetailsChange,
  onInteraction 
}: SegmentFormSelectorProps) {
  const type = selectedNode.data.label.toLowerCase();
  const formProps = {
    details,
    onDetailsChange,
  };

  return (
    <div 
      onClick={onInteraction}
      onMouseDown={onInteraction}
      onPointerDown={onInteraction}
    >
      {type === "flight" ? (
        <MemoizedFlightForm {...formProps} />
      ) : type === "hotel" ? (
        <MemoizedHotelForm {...formProps} />
      ) : type === "car" ? (
        <MemoizedCarForm {...formProps} />
      ) : type === "limo service" || type === "limo" ? (
        <MemoizedLimoForm {...formProps} />
      ) : (
        <MemoizedDefaultForm {...formProps} />
      )}
    </div>
  );
}