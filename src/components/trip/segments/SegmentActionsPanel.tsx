import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SegmentActionsPanelProps {
  onSave: () => void;
}

export function SegmentActionsPanel({ onSave }: SegmentActionsPanelProps) {
  return (
    <div className="p-4 mt-auto border-t">
      <Button onClick={onSave} className="w-full">
        Save Details
      </Button>
    </div>
  );
}