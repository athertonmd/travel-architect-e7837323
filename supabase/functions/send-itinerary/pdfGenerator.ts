import { createBasePDF, embedHeaderImage } from "./utils/pdfUtils.ts";
import { addTripHeader } from "./sections/tripHeader.ts";
import { addSegment } from "./sections/segmentHandler.ts";
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

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
      for (const segment of segments) {
        // Skip traveller segment as it's shown in the header
        if (segment.type.toLowerCase() === 'traveller') continue;
        
        yOffset = await addSegment(page, segment, yOffset, font);
        
        // Check if we need a new page
        if (yOffset < 50) {
          const newPage = pdfDoc.addPage();
          yOffset = newPage.getSize().height - 50;
        }
      }
    }

    // Add page numbers
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      page.drawText(`Page ${i + 1} of ${pageCount}`, {
        x: 250,
        y: 30,
        size: 10,
        font,
        color: rgb(0, 0, 0), // Using rgb helper from pdf-lib
      });
    }

    return pdfDoc.save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};