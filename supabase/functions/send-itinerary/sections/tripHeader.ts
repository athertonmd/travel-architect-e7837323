
import { drawText, drawDivider } from "../utils/pdfUtils.ts";

export const addTripHeader = (page: any, trip: any, yOffset: number, font: any) => {
  console.log('Adding trip header...');
  let currentY = yOffset;
  const lineHeight = 20;

  try {
    if (trip.segments && trip.segments.length > 0) {
      // First look for a traveler specific segment
      const travellerSegment = trip.segments.find((s: any) => 
        s.type?.toLowerCase() === 'traveller' || s.type?.toLowerCase() === 'traveler'
      );
      
      if (travellerSegment?.details?.traveller_names && Array.isArray(travellerSegment.details.traveller_names)) {
        const names = travellerSegment.details.traveller_names;
        const travelersText = `Travel Itinerary for: ${names.join(', ')}`;
        drawText(page, travelersText, 50, currentY, font, 12);
        currentY -= lineHeight * 1.5;
      } else {
        // If no traveler segment, look for traveler names in any segment
        for (const segment of trip.segments) {
          if (segment.details?.traveller_names && Array.isArray(segment.details.traveller_names) && segment.details.traveller_names.length > 0) {
            const names = segment.details.traveller_names;
            const travelersText = `Travel Itinerary for: ${names.join(', ')}`;
            drawText(page, travelersText, 50, currentY, font, 12);
            currentY -= lineHeight * 1.5;
            break; // Use the first segment with traveler names
          }
        }
      }
    }

    drawDivider(page, currentY);
    currentY -= lineHeight;

    console.log('Trip header added successfully');
    return currentY;
  } catch (error) {
    console.error('Error adding trip header:', error);
    throw new Error(`Failed to add trip header: ${error.message}`);
  }
};
