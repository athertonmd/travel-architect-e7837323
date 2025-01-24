import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { drawText, drawDivider, createBasePDF, embedHeaderImage } from "./utils/pdfUtils.ts";
import { addTripHeader } from "./sections/tripHeader.ts";
import { addSegment } from "./sections/segmentHandler.ts";

export const generatePDF = async (trip: any) => {
  console.log('Starting PDF generation...');
  
  try {
    const { pdfDoc, page, font } = await createBasePDF();
    console.log('Created base PDF document');
    
    let yOffset = await embedHeaderImage(pdfDoc, page);
    console.log('Embedded header image');
    
    yOffset = addTripHeader(page, trip, yOffset, font);
    console.log('Added trip header');

    if (trip.segments && Array.isArray(trip.segments)) {
      console.log(`Processing ${trip.segments.length} segments...`);
      for (const segment of trip.segments) {
        try {
          if (segment.type?.toLowerCase() === 'traveller') {
            console.log('Processing traveller segment');
            continue;
          }
          
          yOffset = await addSegment(page, segment, yOffset, font);
          
          if (yOffset < 50) {
            console.log('Adding new page due to low Y offset');
            const newPage = pdfDoc.addPage();
            yOffset = newPage.getSize().height - 50;
          }
        } catch (segmentError) {
          console.error('Error processing segment:', segmentError);
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