
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawSectionHeader, drawDetailRow, drawText } from "../utils/pdfUtils.ts";

export const addTripDetailsSection = (page: any, trip: any, colors: any, yOffset: number, font: any, boldFont: any, settings?: PdfSettings) => {
  console.log("Adding trip details section...");
  let currentY = yOffset;
  
  // Add trip title
  if (trip.title) {
    console.log("Adding trip title:", trip.title);
    drawText(page, trip.title, 50, currentY, boldFont, 18, colors.primaryColor);
    currentY -= 30;
  }

  // Add company name if provided
  if (settings?.companyName && !settings?.bannerImageUrl) {
    drawText(page, settings.companyName, 50, currentY, boldFont, 14, colors.secondaryColor);
    currentY -= 20;
  }

  // Add trip details section
  console.log("Adding trip details section...");
  currentY = drawSectionHeader(page, "Trip Details", currentY, boldFont, colors.primaryColor);

  // Add destination and dates
  if (trip.destination) {
    currentY = drawDetailRow(page, "Destination", trip.destination, currentY, font, boldFont);
  }
  
  if (trip.start_date || trip.end_date) {
    let dateText = formatDateRange(trip.start_date, trip.end_date, settings?.dateFormat);
    currentY = drawDetailRow(page, "Dates", dateText, currentY, font, boldFont);
  }

  currentY -= 20;
  
  return currentY;
};

// Format date range according to settings
export const formatDateRange = (startDate?: string, endDate?: string, dateFormat?: string) => {
  if (!startDate && !endDate) return "";
  
  // Format dates according to settings
  if (dateFormat === "DD/MM/YYYY") {
    return `${startDate?.split('-').reverse().join('/') || 'TBD'} - ${endDate?.split('-').reverse().join('/') || 'TBD'}`;
  } else if (dateFormat === "YYYY-MM-DD") {
    return `${startDate || 'TBD'} - ${endDate || 'TBD'}`;
  } else {
    // Default MM/DD/YYYY
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'TBD';
      const [year, month, day] = dateStr.split('-');
      return `${month}/${day}/${year}`;
    };
    return `${formatDate(startDate || '')} - ${formatDate(endDate || '')}`;
  }
};
