
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawSectionHeader } from "../utils/pdfUtils.ts";
import { sortSegmentsByDate } from "../utils/dateUtils.ts";
import { renderSegmentDetails } from "../utils/segmentRenderer.ts";

export const processSegments = (
  pdfDoc: any, 
  page: any, 
  trip: any, 
  colors: any, 
  yOffset: number, 
  font: any, 
  boldFont: any, 
  settings?: PdfSettings
) => {
  console.log("Processing trip segments...");
  let currentY = yOffset;
  let currentPage = page;
  
  if (!Array.isArray(trip.segments)) {
    console.log("No segments found or segments is not an array");
    return { currentY, currentPage };
  }
  
  // Debug: Log the structure of the first segment
  if (trip.segments.length > 0) {
    console.log("First segment structure:", JSON.stringify(trip.segments[0]).substring(0, 500));
  }
  
  // Sort segments by date if they have dates
  const sortedSegments = sortSegmentsByDate(trip.segments);
  
  for (const segment of sortedSegments) {
    // Defensive programming - ensure the segment has a type
    if (!segment?.type) {
      console.log("Skipping segment without type property");
      continue;
    }
    
    // Skip notes if includeNotes is false
    if (segment.type.toLowerCase() === "notes" && settings?.includeNotes === false) {
      console.log("Skipping notes segment due to settings");
      continue;
    }

    // Check if we need a new page
    if (currentY < 100) {
      console.log("Adding new page...");
      currentPage = pdfDoc.addPage();
      currentY = currentPage.getSize().height - 50;
    }

    console.log("Adding segment:", segment.type);
    currentY = drawSectionHeader(currentPage, segment.type.toUpperCase(), currentY, boldFont, colors.primaryColor);

    // Render segment details
    currentY = renderSegmentDetails(currentPage, segment, currentY, font, boldFont, settings);

    // Add spacing between segments
    currentY -= 20;
  }
  
  console.log("All segments processed successfully");
  return { currentY, currentPage };
};
