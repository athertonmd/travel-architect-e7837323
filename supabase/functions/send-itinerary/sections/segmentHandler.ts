import { drawText, drawDivider } from "../utils/pdfUtils.ts";

const sanitizeDetails = (details: any) => {
  if (!details || typeof details !== 'object') return {};
  
  // Create a new object with only primitive values
  const sanitized: Record<string, string | number | boolean> = {};
  
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

const addFlightDetails = (page: any, details: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  let currentY = yOffset;
  const safeDetails = sanitizeDetails(details);
  
  if (safeDetails.departureAirport) {
    drawText(page, `From: ${safeDetails.departureAirport}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  if (safeDetails.destinationAirport) {
    drawText(page, `To: ${safeDetails.destinationAirport}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  
  return currentY;
};

const addHotelDetails = (page: any, details: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  let currentY = yOffset;
  const safeDetails = sanitizeDetails(details);
  
  if (safeDetails.hotelName) {
    drawText(page, `Hotel: ${safeDetails.hotelName}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  if (safeDetails.checkInDate) {
    drawText(page, `Check-in: ${safeDetails.checkInDate}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  
  return currentY;
};

export const addSegment = (page: any, segment: any, yOffset: number, font: any) => {
  const fontSize = 12;
  const lineHeight = 20;
  let currentY = yOffset;

  try {
    // Add segment type as header
    const segmentType = String(segment.type || 'Unknown').toUpperCase();
    drawText(page, segmentType, 50, currentY, font, fontSize + 2);
    currentY -= lineHeight * 1.5;

    // Add common details
    if (segment.details) {
      const safeDetails = sanitizeDetails(segment.details);
      
      if (safeDetails.date) {
        drawText(page, `Date: ${safeDetails.date}`, 70, currentY, font, fontSize);
        currentY -= lineHeight;
      }
      
      if (safeDetails.time) {
        drawText(page, `Time: ${safeDetails.time}`, 70, currentY, font, fontSize);
        currentY -= lineHeight;
      }

      // Add type-specific details
      switch (segmentType.toLowerCase()) {
        case 'flight':
          currentY = addFlightDetails(page, safeDetails, currentY, font, fontSize, lineHeight);
          break;
        case 'hotel':
          currentY = addHotelDetails(page, safeDetails, currentY, font, fontSize, lineHeight);
          break;
      }
    }

    // Add divider after segment
    currentY -= lineHeight;
    drawDivider(page, currentY);
    currentY -= lineHeight;

    return currentY;
  } catch (error) {
    console.error('Error adding segment:', error);
    return yOffset - (lineHeight * 2); // Return a safe offset to continue with next segment
  }
};