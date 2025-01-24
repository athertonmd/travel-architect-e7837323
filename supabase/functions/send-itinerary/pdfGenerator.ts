import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { drawText, drawDivider, createBasePDF, embedHeaderImage } from "./utils/pdfUtils.ts";
import { addTripHeader } from "./sections/tripHeader.ts";
import { addSegment } from "./sections/segmentHandler.ts";

const sanitizeTripData = (trip: any) => {
  console.log('Sanitizing trip data...');
  try {
    const sanitized = {
      title: String(trip.title || ''),
      destination: String(trip.destination || ''),
      start_date: trip.start_date ? String(trip.start_date) : null,
      end_date: trip.end_date ? String(trip.end_date) : null,
      travelers: Number(trip.travelers) || 0,
      segments: Array.isArray(trip.segments) ? trip.segments : []
    };
    console.log('Trip data sanitized successfully');
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing trip data:', error);
    throw new Error('Failed to sanitize trip data');
  }
};

export const generatePDF = async (trip: any) => {
  console.log('Starting PDF generation...');
  
  try {
    const { pdfDoc, page, font } = await createBasePDF();
    console.log('Created base PDF document');
    
    const sanitizedTrip = sanitizeTripData(trip);
    console.log('Sanitized trip data');
    
    let yOffset = await embedHeaderImage(pdfDoc, page);
    console.log('Embedded header image');
    
    yOffset = addTripHeader(page, sanitizedTrip, yOffset, font);
    console.log('Added trip header');

    if (sanitizedTrip.segments && sanitizedTrip.segments.length > 0) {
      console.log(`Processing ${sanitizedTrip.segments.length} segments...`);
      for (const segment of sanitizedTrip.segments) {
        try {
          if (segment.type?.toLowerCase() === 'traveller') {
            console.log('Skipping traveller segment as it\'s shown in header');
            continue;
          }
          
          yOffset = await addSegment(page, segment, yOffset, font);
          
          if (yOffset < 50) {
            console.log('Adding new page due to low Y offset');
            const newPage = pdfDoc.addPage();
            yOffset = newPage.getSize().height - 50;
          }
        } catch (segmentError) {
          console.error('Error processing segment:', segment, segmentError);
          continue;
        }
      }
    }

    const pageCount = pdfDoc.getPageCount();
    console.log(`Adding page numbers for ${pageCount} pages`);
    for (let i = 0; i < pageCount; i++) {
      const currentPage = pdfDoc.getPage(i);
      drawText(currentPage, `Page ${i + 1} of ${pageCount}`, 250, 30, font, 10);
    }

    console.log('PDF generation completed successfully');
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};