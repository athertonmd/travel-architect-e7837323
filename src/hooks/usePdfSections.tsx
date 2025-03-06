
import { useState } from "react";
import { PdfSection } from "@/types/pdf";

const defaultSections: PdfSection[] = [
  { id: "trip-header", name: "Trip Header", included: true },
  { id: "traveler-info", name: "Traveler Information", included: true },
  { id: "flight", name: "Flight Details", included: true },
  { id: "hotel", name: "Hotel Reservations", included: true },
  { id: "car", name: "Car Rental", included: true },
  { id: "activities", name: "Activities", included: true },
  { id: "restaurants", name: "Restaurants", included: true },
  { id: "transfers", name: "Transfers", included: false },
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
