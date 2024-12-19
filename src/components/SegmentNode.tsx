import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

export function SegmentNode({ data, id, selected }: { 
  data: SegmentNodeData; 
  id: string; 
  selected?: boolean 
}) {
  const destinationAirport = data.details?.destinationAirport;
  const hotelName = data.details?.hotelName;
  
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Top} />
      <Button
        variant="outline"
        className={`min-w-40 text-center bg-white drag-handle cursor-move ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="flex items-center justify-center gap-2">
          <span>{data.icon}</span>
          <span>{data.label}</span>
          {data.details?.time && <span className="text-sm text-muted-foreground">({data.details.time})</span>}
          {data.label.toLowerCase() === 'flight' && destinationAirport && (
            <span className="text-sm text-muted-foreground">→ {destinationAirport}</span>
          )}
          {data.label.toLowerCase() === 'hotel' && hotelName && (
            <span className="text-sm text-muted-foreground">- {String(hotelName)}</span>
          )}
        </div>
      </Button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}