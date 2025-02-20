
import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { SegmentNodeData } from "@/types/segment";

export function SegmentNode({ data, id, selected }: { 
  data: SegmentNodeData; 
  id: string; 
  selected?: boolean 
}) {
  const destinationAirport = data.details?.destinationAirport;
  const destinationStation = data.details?.destinationStation;
  const hotelName = data.details?.hotelName;
  const provider = data.details?.provider as string | undefined;
  const travelerCount = Array.isArray(data.details?.traveller_names) ? data.details.traveller_names.length : 0;
  const showTravelers = data.label.toLowerCase() !== 'limo service' && data.label.toLowerCase() !== 'limo';
  const showProvider = provider && provider.trim() !== '';
  const isLimoType = data.label.toLowerCase() === 'limo service' || data.label.toLowerCase() === 'limo';
  const isTransfer = data.label.toLowerCase() === 'transfer';
  
  // Helper function to safely convert value to string
  const safeToString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '';
      }
    }
    return String(value);
  };

  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Top} />
      <Button
        variant="outline"
        className={`min-w-[200px] inline-flex whitespace-nowrap px-6 py-3 bg-white text-blue-500 drag-handle cursor-move ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="flex items-center gap-2">
          <span>{data.icon}</span>
          <span>{data.label}</span>
          {data.details?.time && <span className="text-sm text-muted-foreground">({data.details.time})</span>}
          {data.label.toLowerCase() === 'flight' && destinationAirport && (
            <span className="text-sm text-muted-foreground">→ {safeToString(destinationAirport)}</span>
          )}
          {data.label.toLowerCase() === 'train' && destinationStation && (
            <span className="text-sm text-muted-foreground">→ {safeToString(destinationStation)}</span>
          )}
          {data.label.toLowerCase() === 'hotel' && hotelName && (
            <span className="text-sm text-muted-foreground">- {safeToString(hotelName)}</span>
          )}
          {(data.label.toLowerCase() === 'car' || isLimoType || isTransfer) && showProvider && (
            <span className="text-sm text-muted-foreground">({provider})</span>
          )}
          {showTravelers && travelerCount > 0 && (
            <span className="text-sm text-muted-foreground">
              ({travelerCount} {travelerCount === 1 ? 'traveler' : 'travelers'})
            </span>
          )}
        </div>
      </Button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
