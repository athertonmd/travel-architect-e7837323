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
  const provider = data.details?.provider as string | undefined;
  const travelerCount = Array.isArray(data.details?.traveller_names) ? data.details.traveller_names.length : 0;
  const showTravelers = data.label.toLowerCase() !== 'limo service' && data.label.toLowerCase() !== 'limo';
  const showProvider = provider && provider.trim() !== '';
  const isLimoType = data.label.toLowerCase() === 'limo service' || data.label.toLowerCase() === 'limo';
  
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Top} />
      <Button
        variant="outline"
        className={`w-fit min-w-[200px] max-w-[800px] text-center bg-white text-blue-500 drag-handle cursor-move ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="flex items-center justify-start gap-2 px-4 w-full">
          <span className="flex-shrink-0">{data.icon}</span>
          <span className="flex-shrink-0">{data.label}</span>
          {data.details?.time && <span className="text-sm text-muted-foreground flex-shrink-0">({data.details.time})</span>}
          {data.label.toLowerCase() === 'flight' && destinationAirport && (
            <span className="text-sm text-muted-foreground flex-shrink-0">→ {destinationAirport}</span>
          )}
          {data.label.toLowerCase() === 'hotel' && hotelName && (
            <span className="text-sm text-muted-foreground flex-shrink-0">- {String(hotelName)}</span>
          )}
          {(data.label.toLowerCase() === 'car' || isLimoType) && showProvider && (
            <span className="text-sm text-muted-foreground flex-shrink-0">({provider})</span>
          )}
          {showTravelers && travelerCount > 0 && (
            <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">
              ({travelerCount} {travelerCount === 1 ? 'traveler' : 'travelers'})
            </span>
          )}
        </div>
      </Button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}