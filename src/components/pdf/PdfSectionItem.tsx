
import { Button } from "@/components/ui/button";
import { GripVertical, LayoutGrid, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PdfSection } from "@/types/pdf";

interface PdfSectionItemProps {
  section: PdfSection;
  draggedSection: string | null;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onToggleInclusion: (id: string) => void;
}

export function PdfSectionItem({
  section,
  draggedSection,
  onDragStart,
  onDragOver,
  onDragEnd,
  onToggleInclusion,
}: PdfSectionItemProps) {
  return (
    <div
      key={section.id}
      className={cn(
        "flex items-center p-3 rounded-md border bg-navy-light text-white",
        !section.included && "opacity-60",
        draggedSection === section.id && "border-gold"
      )}
      draggable
      onDragStart={() => onDragStart(section.id)}
      onDragOver={(e) => onDragOver(e, section.id)}
      onDragEnd={onDragEnd}
    >
      <div className="cursor-move mr-2">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="mr-2">
        <LayoutGrid className="h-5 w-5 text-gold" />
      </div>
      <span className="flex-1">{section.name}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleInclusion(section.id)}
        className="ml-2"
      >
        {section.included ? (
          <X className="h-4 w-4 text-gray-400" />
        ) : (
          <span className="text-xs text-gold">Include</span>
        )}
      </Button>
    </div>
  );
}
