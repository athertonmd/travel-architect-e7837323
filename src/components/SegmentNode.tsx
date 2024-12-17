import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Handle, Position } from "@xyflow/react";

export function SegmentNode({ data }: { data: { label: string; icon: string } }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="min-w-40 justify-start gap-2 bg-white"
          >
            <span>{data.icon}</span>
            {data.label}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {data.icon} {data.label} Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Form fields will be added here based on segment type */}
            <p className="text-sm text-muted-foreground">
              Form for {data.label} will be added here
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}