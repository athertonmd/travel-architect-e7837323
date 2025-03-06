
import { PdfSectionItem } from "./PdfSectionItem";
import { usePdfSections } from "@/hooks/usePdfSections";

export function PdfSectionOrder() {
  const {
    sections,
    draggedSection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    toggleSectionInclusion
  } = usePdfSections();

  return (
    <div className="space-y-2">
      {sections.map(section => (
        <PdfSectionItem
          key={section.id}
          section={section}
          draggedSection={draggedSection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onToggleInclusion={toggleSectionInclusion}
        />
      ))}
    </div>
  );
}
