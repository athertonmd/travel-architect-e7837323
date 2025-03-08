
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawSectionHeader, drawDetailRow } from "../utils/pdfUtils.ts";

export const processSegments = (pdfDoc: any, page: any, trip: any, colors: any, yOffset: number, font: any, boldFont: any, settings?: PdfSettings) => {
  console.log("Processing trip segments...");
  let currentY = yOffset;
  let currentPage = page;
  
  if (!Array.isArray(trip.segments)) {
    console.log("No segments found or segments is not an array");
    return { currentY, currentPage };
  }
  
  // Sort segments by date if they have dates
  let sortedSegments = [...trip.segments];
  
  // Only apply chronological ordering to segments with dates
  // This ensures segments with dates appear in order, and segments without dates maintain their original position
  sortedSegments.sort((a, b) => {
    const aDate = a.details?.date || a.details?.start_date || null;
    const bDate = b.details?.date || b.details?.start_date || null;
    
    // If both have dates, compare them
    if (aDate && bDate) {
      return new Date(aDate).getTime() - new Date(bDate).getTime();
    }
    
    // If only one has a date, prioritize the one with a date
    if (aDate) return -1;
    if (bDate) return 1;
    
    // If neither has a date, maintain original order
    return 0;
  });
  
  for (const segment of sortedSegments) {
    if (!segment?.type) continue;
    
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

    if (segment.details && typeof segment.details === 'object') {
      for (const [key, value] of Object.entries(segment.details)) {
        // Skip contact info if includeContactInfo is false
        if (settings?.includeContactInfo === false && 
            (key.toLowerCase().includes('contact') || 
             key.toLowerCase().includes('phone') || 
             key.toLowerCase().includes('email'))) {
          continue;
        }
        
        if (value && typeof value !== 'object') {
          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          currentY = drawDetailRow(currentPage, label, String(value), currentY, font, boldFont);
        }
      }
    }

    currentY -= 20;
  }
  
  console.log("All segments processed successfully");
  return { currentY, currentPage };
};
