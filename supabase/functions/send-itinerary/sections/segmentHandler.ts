import { drawText, drawDivider } from "../utils/pdfUtils.ts";

const sanitizeDetails = (details: any) => {
  console.log('Sanitizing segment details...');
  if (!details || typeof details !== 'object') {
    console.log('No details to sanitize, returning empty object');
    return {};
  }
  
  const sanitized: Record<string, string | number | boolean> = {};
  
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }
  
  console.log('Details sanitized successfully');
  return sanitized;
};

const addFlightDetails = (page: any, details: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  console.log('Adding flight details...');
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
  console.log('Adding hotel details...');
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
  console.log('Adding segment to PDF...');
  const fontSize = 12;
  const lineHeight = 20;
  let currentY = yOffset;

  try {
    const segmentType = String(segment.type || 'Unknown').toUpperCase();
    console.log(`Processing segment of type: ${segmentType}`);
    
    drawText(page, segmentType, 50, currentY, font, fontSize + 2);
    currentY -= lineHeight * 1.5;

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

      switch (segmentType.toLowerCase()) {
        case 'flight':
          currentY = addFlightDetails(page, safeDetails, currentY, font, fontSize, lineHeight);
          break;
        case 'hotel':
          currentY = addHotelDetails(page, safeDetails, currentY, font, fontSize, lineHeight);
          break;
      }
    }

    currentY -= lineHeight;
    drawDivider(page, currentY);
    currentY -= lineHeight;

    console.log('Segment added successfully');
    return currentY;
  } catch (error) {
    console.error('Error adding segment:', error);
    throw new Error(`Failed to add segment: ${error.message}`);
  }
};