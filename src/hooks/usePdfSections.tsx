
import { useState } from "react";
import { PdfSection } from "@/types/pdf";

const defaultSections: PdfSection[] = [
  { id: "quick-links", name: "Quick Links", included: true },
  { id: "notes", name: "Notes", included: true },
];

export function usePdfSections() {
  const [sections, setSections] = useState<PdfSection[]>(defaultSections);
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

  return {
    sections,
    draggedSection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    toggleSectionInclusion
  };
}
