
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

type PdfSection = {
  id: string;
  name: string;
  included: boolean;
};

export function PdfSectionOrder() {
  const [sections, setSections] = useState<PdfSection[]>([
    { id: "trip-header", name: "Trip Header", included: true },
    { id: "traveler-info", name: "Traveler Information", included: true },
    { id: "flight", name: "Flight Details", included: true },
    { id: "hotel", name: "Hotel Reservations", included: true },
    { id: "car", name: "Car Rental", included: true },
    { id: "activities", name: "Activities", included: true },
    { id: "restaurants", name: "Restaurants", included: true },
    { id: "transfers", name: "Transfers", included: false },
    { id: "notes", name: "Notes", included: true },
  ]);

  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedSection(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === id) return;

    const draggedIndex = sections.findIndex(section => section.id === draggedSection);
    const targetIndex = sections.findIndex(section => section.id === id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    setSections(newSections);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  const toggleSectionInclusion = (id: string) => {
    setSections(sections.map(section => 
      section.id === id 
        ? { ...section, included: !section.included } 
        : section
    ));
  };

  return (
    <div className="space-y-2">
      {sections.map(section => (
        <div
          key={section.id}
          className={cn(
            "flex items-center p-3 rounded-md border bg-navy-light text-white",
            !section.included && "opacity-60",
            draggedSection === section.id && "border-gold"
          )}
          draggable
          onDragStart={() => handleDragStart(section.id)}
          onDragOver={(e) => handleDragOver(e, section.id)}
          onDragEnd={handleDragEnd}
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
            onClick={() => toggleSectionInclusion(section.id)}
            className="ml-2"
          >
            {section.included ? (
              <X className="h-4 w-4 text-gray-400" />
            ) : (
              <span className="text-xs text-gold">Include</span>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}
