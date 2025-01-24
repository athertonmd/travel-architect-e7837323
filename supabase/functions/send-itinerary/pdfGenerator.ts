import { createBasePDF, embedHeaderImage } from "./utils/pdfUtils.ts";
import { addTripHeader } from "./sections/tripHeader.ts";
import { addSegment } from "./sections/segmentHandler.ts";

export const generatePDF = async (trip: any) => {
  const { pdfDoc, page, font } = await createBasePDF();
  
  try {
    // Add header image and get starting Y position
    let yOffset = await embedHeaderImage(pdfDoc, page);
    
    // Add trip header information
    yOffset = addTripHeader(page, trip, yOffset, font);

    // Add segments
    const segments = typeof trip.segments === 'string' 
      ? JSON.parse(trip.segments) 
      : trip.segments;

    if (segments && segments.length > 0) {
      // Add segments title
      page.drawText('Itinerary Details:', {
        x: 50,
        y: yOffset,
        size: 14,
        font,
        color: { r: 0, g: 0, b: 0 },
      });
      yOffset -= 30;

      for (const segment of segments) {
        yOffset = await addSegment(page, segment, yOffset, font);
        
        // Check if we need a new page
        if (yOffset < 50) {
          const newPage = pdfDoc.addPage();
          yOffset = newPage.getSize().height - 50;
        }
      }
    }

    return pdfDoc.save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};