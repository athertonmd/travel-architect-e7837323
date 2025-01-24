import { drawText, drawDivider } from "../utils/pdfUtils.ts";

export const addTripHeader = (page: any, trip: any, yOffset: number, font: any) => {
  let currentY = yOffset;
  const lineHeight = 20;

  // Add travelers list
  if (trip.segments && trip.segments.length > 0) {
    const travellerSegment = trip.segments.find((s: any) => s.type.toLowerCase() === 'traveller');
    if (travellerSegment && travellerSegment.details?.traveller_names) {
      const names = travellerSegment.details.traveller_names;
      const travelersText = `Travel Itinerary for: ${names.join(', ')}`;
      drawText(page, travelersText, 50, currentY, font, 12);
      currentY -= lineHeight * 1.5;
    }
  }

  // Draw divider after header
  drawDivider(page, currentY);
  currentY -= lineHeight;

  return currentY;
};