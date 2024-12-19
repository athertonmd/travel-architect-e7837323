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
    <div>
      <Handle type="target" position={Position.Top} />
      <Button
        variant="outline"
        className={`min-w-40 justify-start gap-2 bg-white drag-handle cursor-move ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <span>{data.icon}</span>
        {data.label}
        {data.details?.time && <span className="ml-2 text-sm text-muted-foreground">({data.details.time})</span>}
        {data.label.toLowerCase() === 'flight' && destinationAirport && (
          <span className="ml-2 text-sm text-muted-foreground">→ {destinationAirport}</span>
        )}
        {data.label.toLowerCase() === 'hotel' && hotelName && (
          <span className="ml-2 text-sm text-muted-foreground">- {hotelName}</span>
        )}
      </Button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}