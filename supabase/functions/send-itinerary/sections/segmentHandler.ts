import { drawText, drawDivider } from "../utils/pdfUtils.ts";

const addFlightDetails = (page: any, details: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  let currentY = yOffset;
  
  if (details.departureAirport) {
    drawText(page, `From: ${details.departureAirport}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  if (details.destinationAirport) {
    drawText(page, `To: ${details.destinationAirport}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  
  return currentY;
};

const addHotelDetails = (page: any, details: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  let currentY = yOffset;
  
  if (details.hotelName) {
    drawText(page, `Hotel: ${details.hotelName}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  if (details.checkInDate) {
    drawText(page, `Check-in: ${details.checkInDate}`, 70, currentY, font, fontSize);
    currentY -= lineHeight;
  }
  
  return currentY;
};

export const addSegment = (page: any, segment: any, yOffset: number, font: any) => {
  const fontSize = 12;
  const lineHeight = 20;
  let currentY = yOffset;

  // Add segment type as header
  drawText(page, segment.type.toUpperCase(), 50, currentY, font, fontSize + 2);
  currentY -= lineHeight * 1.5;

  // Add common details
  if (segment.details) {
    const details = segment.details;
    
    if (details.date) {
      drawText(page, `Date: ${details.date}`, 70, currentY, font, fontSize);
      currentY -= lineHeight;
    }
    
    if (details.time) {
      drawText(page, `Time: ${details.time}`, 70, currentY, font, fontSize);
      currentY -= lineHeight;
    }

    // Add type-specific details
    switch (segment.type.toLowerCase()) {
      case 'flight':
        currentY = addFlightDetails(page, details, currentY, font, fontSize, lineHeight);
        break;
      case 'hotel':
        currentY = addHotelDetails(page, details, currentY, font, fontSize, lineHeight);
        break;
    }
  }

  // Add divider after segment
  currentY -= lineHeight;
  drawDivider(page, currentY);
  currentY -= lineHeight;

  return currentY;
};