import { drawText } from "../utils/pdfUtils.ts";

export const addTripHeader = (page: any, trip: any, yOffset: number, font: any) => {
  let currentY = yOffset;
  const lineHeight = 20;

  // Add title
  drawText(page, `Trip Itinerary: ${trip.title}`, 50, currentY, font, 16);
  currentY -= lineHeight * 2;

  // Add destination
  if (trip.destination) {
    drawText(page, `Destination: ${trip.destination}`, 50, currentY, font, 12);
    currentY -= lineHeight;
  }

  // Add dates
  if (trip.start_date || trip.end_date) {
    const dateText = `Date: ${trip.start_date || ''} ${trip.end_date ? `to ${trip.end_date}` : ''}`;
    drawText(page, dateText, 50, currentY, font, 12);
    currentY -= lineHeight * 2;
  }

  return currentY;
};