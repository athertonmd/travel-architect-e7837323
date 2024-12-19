import { Node } from "@xyflow/react";
import { FlightSegmentForm } from "./segments/FlightSegmentForm";
import { DefaultSegmentForm } from "./segments/DefaultSegmentForm";
import { SegmentDetails as ISegmentDetails, SegmentNodeData } from "@/types/segment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { memo, useCallback, useRef, useState, useEffect } from "react";

type SegmentDetailsProps = {
  selectedNode: Node<SegmentNodeData> | null;
  onDetailsChange: (nodeId: string, details: ISegmentDetails) => void;
};

const areDetailsEqual = (prevProps: { details: ISegmentDetails; onDetailsChange: any }, 
                        nextProps: { details: ISegmentDetails; onDetailsChange: any }) => {
  return JSON.stringify(prevProps.details) === JSON.stringify(nextProps.details);
};

const MemoizedFlightForm = memo(({ details, onDetailsChange }: { 
  details: ISegmentDetails; 
  onDetailsChange: (details: ISegmentDetails) => void;
}) => (
  <FlightSegmentForm details={details} onDetailsChange={onDetailsChange} />
), areDetailsEqual);

MemoizedFlightForm.displayName = 'MemoizedFlightForm';

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
    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    document.dispatchEvent(event);
    toast.success("Segment deleted successfully!");
  }, []);

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
      <div 
        onClick={stopPropagation} 
        onMouseDown={stopPropagation}
        onPointerDown={stopPropagation}
        className="segment-form-container"
      >
        {type === "flight" ? (
          <MemoizedFlightForm {...formProps} />
        ) : (
          <MemoizedDefaultForm {...formProps} />
        )}
      </div>
    );
  };

  return (
    <div 
      ref={panelRef}
      className="h-full p-4 bg-white" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedNode.data.icon}</span>
          <h3 className="font-semibold">{selectedNode.data.label} Details</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {renderSegmentForm()}

      <div className="mt-6">
        <Button onClick={handleSave} className="w-full">
          Save Details
        </Button>
      </div>
    </div>
  );
}