import { Node } from "@xyflow/react";
import { FlightSegmentForm } from "./segments/FlightSegmentForm";
import { DefaultSegmentForm } from "./segments/DefaultSegmentForm";
import { HotelSegmentForm } from "./segments/HotelSegmentForm";
import { CarSegmentForm } from "./segments/CarSegmentForm";
import { SegmentDetails as ISegmentDetails, SegmentNodeData } from "@/types/segment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { memo, useCallback, useRef, useState, useEffect } from "react";
import { SegmentHeader } from "./segments/SegmentHeader";
import { SegmentFormContainer } from "./segments/SegmentFormContainer";
import { ScrollArea } from "@/components/ui/scroll-area";

type SegmentDetailsProps = {
  selectedNode: Node<SegmentNodeData> | null;
  onDetailsChange: (nodeId: string, details: ISegmentDetails) => void;
};

const areDetailsEqual = (
  prevProps: { details: ISegmentDetails; onDetailsChange: any }, 
  nextProps: { details: ISegmentDetails; onDetailsChange: any }
) => {
  return JSON.stringify(prevProps.details) === JSON.stringify(nextProps.details);
};

const MemoizedFlightForm = memo(({ details, onDetailsChange }: { 
  details: ISegmentDetails; 
  onDetailsChange: (details: ISegmentDetails) => void;
}) => (
  <FlightSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedFlightForm.displayName = 'MemoizedFlightForm';

const MemoizedHotelForm = memo(({ details, onDetailsChange }: {
  details: ISegmentDetails;
  onDetailsChange: (details: ISegmentDetails) => void;
}) => (
  <HotelSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedHotelForm.displayName = 'MemoizedHotelForm';

const MemoizedCarForm = memo(({ details, onDetailsChange }: {
  details: ISegmentDetails;
  onDetailsChange: (details: ISegmentDetails) => void;
}) => (
  <CarSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedCarForm.displayName = 'MemoizedCarForm';

const MemoizedDefaultForm = memo(({ details, onDetailsChange }: {
  details: ISegmentDetails;
  onDetailsChange: (details: ISegmentDetails) => void;
}) => (
  <DefaultSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedDefaultForm.displayName = 'MemoizedDefaultForm';

export function SegmentDetails({ selectedNode, onDetailsChange }: SegmentDetailsProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [localDetails, setLocalDetails] = useState<ISegmentDetails>({});
  
  useEffect(() => {
    if (selectedNode?.data?.details) {
      setLocalDetails(selectedNode.data.details);
    }
  }, [selectedNode]);

  const handleLocalDetailsChange = useCallback((newDetails: ISegmentDetails) => {
    console.log('Local details changing:', newDetails);
    setLocalDetails(newDetails);
  }, []);

  const stopPropagation = useCallback((e: React.MouseEvent | React.FocusEvent) => {
    e.stopPropagation();
  }, []);

  const handleSave = useCallback(() => {
    if (selectedNode) {
      onDetailsChange(selectedNode.id, localDetails);
      toast.success("Segment details saved successfully!");
    }
  }, [selectedNode, onDetailsChange, localDetails]);

  const handleDelete = useCallback(() => {
    if (selectedNode) {
      const flowContainer = document.querySelector('.react-flow');
      if (flowContainer) {
        const deleteEvent = new KeyboardEvent('keydown', {
          key: 'Delete',
          code: 'Delete',
          keyCode: 46,
          which: 46,
          bubbles: true,
          cancelable: true
        });
        flowContainer.dispatchEvent(deleteEvent);
        toast.success("Segment deleted successfully!");
      }
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="h-full p-4 bg-white">
        <p className="text-muted-foreground">Select a segment to view and edit its details</p>
      </div>
    );
  }

  const renderSegmentForm = () => {
    const type = selectedNode.data.label.toLowerCase();
    const formProps = {
      details: localDetails,
      onDetailsChange: handleLocalDetailsChange,
    };

    return (
      <SegmentFormContainer onInteraction={stopPropagation}>
        {type === "flight" ? (
          <MemoizedFlightForm {...formProps} />
        ) : type === "hotel" ? (
          <MemoizedHotelForm {...formProps} />
        ) : type === "car" ? (
          <MemoizedCarForm {...formProps} />
        ) : (
          <MemoizedDefaultForm {...formProps} />
        )}
      </SegmentFormContainer>
    );
  };

  return (
    <div 
      ref={panelRef}
      className="h-full flex flex-col bg-white" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <div className="p-4">
        <SegmentHeader 
          icon={selectedNode.data.icon}
          label={selectedNode.data.label}
          onDelete={handleDelete}
        />
      </div>
      
      <ScrollArea className="flex-1 px-4">
        {renderSegmentForm()}
      </ScrollArea>

      <div className="p-4 mt-auto border-t">
        <Button onClick={handleSave} className="w-full">
          Save Details
        </Button>
      </div>
    </div>
  );
}