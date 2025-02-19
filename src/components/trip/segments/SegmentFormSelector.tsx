
import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentDetails } from "@/types/segment";
import { FlightSegmentForm } from "./FlightSegmentForm";
import { HotelSegmentForm } from "./HotelSegmentForm";
import { CarSegmentForm } from "./CarSegmentForm";
import { LimoSegmentForm } from "./LimoSegmentForm";
import { TransferSegmentForm } from "./TransferSegmentForm";
import { RestaurantSegmentForm } from "./RestaurantSegmentForm";
import { ActivitySegmentForm } from "./ActivitySegmentForm";
import { VipSegmentForm } from "./VipSegmentForm";
import { DefaultSegmentForm } from "./DefaultSegmentForm";

interface SegmentFormSelectorProps {
  selectedNode: Node<SegmentNodeData>;
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
  onInteraction?: (e: React.MouseEvent | React.FocusEvent) => void;
}

export function SegmentFormSelector({
  selectedNode,
  details,
  onDetailsChange,
  onInteraction
}: SegmentFormSelectorProps) {
  const type = selectedNode?.data?.label?.toLowerCase() || '';

  switch (type) {
    case 'flight':
      return <FlightSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'hotel':
      return <HotelSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'car':
      return <CarSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'limo service':
    case 'limo':
      return <LimoSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'transfer':
      return <TransferSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'restaurant':
      return <RestaurantSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'activity':
      return <ActivitySegmentForm details={details} onDetailsChange={onDetailsChange} />;
    case 'vip':
    case 'vip service':
      return <VipSegmentForm details={details} onDetailsChange={onDetailsChange} />;
    default:
      return <DefaultSegmentForm details={details} onDetailsChange={onDetailsChange} />;
  }
}
