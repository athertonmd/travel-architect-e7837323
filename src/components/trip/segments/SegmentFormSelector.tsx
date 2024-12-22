import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentDetails } from "@/types/segment";
import { DefaultSegmentForm } from "./DefaultSegmentForm";
import { FlightSegmentForm } from "./FlightSegmentForm";
import { HotelSegmentForm } from "./HotelSegmentForm";
import { CarSegmentForm } from "./CarSegmentForm";
import { LimoSegmentForm } from "./LimoSegmentForm";
import { TransferSegmentForm } from "./TransferSegmentForm";

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
  onInteraction,
}: SegmentFormSelectorProps) {
  const segmentType = selectedNode.data.label.toLowerCase();

  switch (segmentType) {
    case 'flight':
      return (
        <FlightSegmentForm
          details={details}
          onDetailsChange={onDetailsChange}
        />
      );
    case 'hotel':
      return (
        <HotelSegmentForm
          details={details}
          onDetailsChange={onDetailsChange}
        />
      );
    case 'car':
      return (
        <CarSegmentForm
          details={details}
          onDetailsChange={onDetailsChange}
        />
      );
    case 'limo':
    case 'limo service':
      return (
        <LimoSegmentForm
          details={details}
          onDetailsChange={onDetailsChange}
        />
      );
    case 'transfer':
      return (
        <TransferSegmentForm
          details={details}
          onDetailsChange={onDetailsChange}
        />
      );
    default:
      return (
        <DefaultSegmentForm
          details={details}
          onDetailsChange={onDetailsChange}
        />
      );
  }
}