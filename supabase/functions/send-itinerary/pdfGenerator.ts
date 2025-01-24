import { createBasePDF, embedHeaderImage } from "./utils/pdfUtils.ts";
import { addTripHeader } from "./sections/tripHeader.ts";
import { addSegment } from "./sections/segmentHandler.ts";
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

const sanitizeTripData = (trip: any) => {
  return {
    title: String(trip.title || ''),
    destination: String(trip.destination || ''),
    start_date: trip.start_date ? String(trip.start_date) : null,
    end_date: trip.end_date ? String(trip.end_date) : null,
    travelers: Number(trip.travelers) || 0,
    segments: Array.isArray(trip.segments) ? trip.segments : []
  };
};

export const generatePDF = async (trip: any) => {
  console.log('Starting PDF generation with trip:', JSON.stringify(trip, null, 2));
  
  try {
    const { pdfDoc, page, font } = await createBasePDF();
    const sanitizedTrip = sanitizeTripData(trip);
    
    // Add header image and get starting Y position
    let yOffset = await embedHeaderImage(pdfDoc, page);
    
    // Add trip header information
    yOffset = addTripHeader(page, sanitizedTrip, yOffset, font);

    // Add segments
    if (sanitizedTrip.segments.length > 0) {
      for (const segment of sanitizedTrip.segments) {
        // Skip traveller segment as it's shown in the header
        if (segment.type?.toLowerCase() === 'traveller') continue;
        
        try {
          yOffset = await addSegment(page, segment, yOffset, font);
          
          // Check if we need a new page
          if (yOffset < 50) {
            const newPage = pdfDoc.addPage();
            yOffset = newPage.getSize().height - 50;
          }
        } catch (segmentError) {
          console.error('Error processing segment:', segment, segmentError);
          // Continue with next segment instead of failing entire PDF
          continue;
        }
      }
    }

    // Add page numbers
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const currentPage = pdfDoc.getPage(i);
      currentPage.drawText(`Page ${i + 1} of ${pageCount}`, {
        x: 250,
        y: 30,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
    }

    console.log('PDF generation completed successfully');
    return pdfDoc.save();
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};