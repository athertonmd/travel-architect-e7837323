import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";
import { useCallback } from "react";

type SegmentDetails = {
  notes?: string;
  time?: string;
  location?: string;
};

export function SegmentNode({ data, id, selected }: { data: { label: string; icon: string; details?: SegmentDetails; onSelect?: (id: string) => void }; id: string; selected?: boolean }) {
  const handleClick = useCallback(() => {
    data.onSelect?.(id);
  }, [id, data]);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Button
        variant="outline"
        className={`min-w-40 justify-start gap-2 bg-white drag-handle cursor-move ${selected ? 'ring-2 ring-primary' : ''}`}
        onClick={handleClick}
      >
        <span>{data.icon}</span>
        {data.label}
        {data.details?.time && <span className="ml-2 text-sm text-muted-foreground">({data.details.time})</span>}
      </Button>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}