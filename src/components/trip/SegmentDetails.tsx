
import { Node } from "@xyflow/react";
import { SegmentNodeData, SegmentDetails as ISegmentDetails } from "@/types/segment";
import { toast } from "sonner";
import { useCallback, useRef, useState, useEffect } from "react";
import { SegmentHeader } from "./segments/SegmentHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SegmentFormSelector } from "./segments/SegmentFormSelector";
import { SegmentActionsPanel } from "./segments/SegmentActionsPanel";

interface SegmentDetailsProps {
  selectedNode: Node<SegmentNodeData> | null;
  onDetailsChange: (nodeId: string, details: ISegmentDetails) => void;
}

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
      <div className="h-full p-4 bg-white text-gray-500">
        <p className="text-muted-foreground">Select a segment to view and edit its details</p>
      </div>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="h-full flex flex-col bg-white rounded-lg shadow-sm" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
    >
      <div className="p-4 bg-white border-b">
        <SegmentHeader 
          icon={selectedNode.data.icon}
          label={selectedNode.data.label}
          onDelete={handleDelete}
        />
      </div>
      
      <ScrollArea className="flex-1 px-4 bg-white">
        <SegmentFormSelector
          selectedNode={selectedNode}
          details={localDetails}
          onDetailsChange={handleLocalDetailsChange}
          onInteraction={stopPropagation}
        />
      </ScrollArea>

      <SegmentActionsPanel onSave={handleSave} />
    </div>
  );
}
