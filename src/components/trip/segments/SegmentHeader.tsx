import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SegmentHeaderProps {
  icon: string;
  label: string;
  onDelete: () => void;
}

export function SegmentHeader({ icon, label, onDelete }: SegmentHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-blue-500">{label} Details</h3>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onDelete}
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}