import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { drawText, drawDivider, createBasePDF, embedHeaderImage } from "./utils/pdfUtils.ts";

export const generatePDF = async (trip: any) => {
  console.log('Starting PDF generation...');
  
  try {
    const { pdfDoc, page, font } = await createBasePDF();
    console.log('Created base PDF document');
    
    let yOffset = await embedHeaderImage(pdfDoc, page);
    console.log('Embedded header image');
    
    // Add trip title
    drawText(page, `Trip: ${trip.title}`, 50, yOffset, font, 14);
    yOffset -= 30;

    // Add destination if available
    if (trip.destination) {
      drawText(page, `Destination: ${trip.destination}`, 50, yOffset, font, 12);
      yOffset -= 20;
    }

    // Add dates if available
    if (trip.start_date || trip.end_date) {
      const dateText = `Date: ${trip.start_date || 'TBD'} - ${trip.end_date || 'TBD'}`;
      drawText(page, dateText, 50, yOffset, font, 12);
      yOffset -= 20;
    }

    drawDivider(page, yOffset);
    yOffset -= 20;

    // Process segments
    if (trip.segments && Array.isArray(trip.segments)) {
      console.log(`Processing ${trip.segments.length} segments...`);
      
      for (const segment of trip.segments) {
        try {
          if (!segment.type) continue;
          
          // Draw segment type header
          drawText(page, segment.type.toUpperCase(), 50, yOffset, font, 12);
          yOffset -= 20;

          // Process segment details
          if (segment.details && typeof segment.details === 'object') {
            for (const [key, value] of Object.entries(segment.details)) {
              if (value && typeof value !== 'object') {
                const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                drawText(page, `${label}: ${value}`, 70, yOffset, font, 10);
                yOffset -= 15;
              }
            }
          }

          yOffset -= 10;
          drawDivider(page, yOffset);
          yOffset -= 20;

          // Check if we need a new page
          if (yOffset < 50) {
            const newPage = pdfDoc.addPage();
            yOffset = newPage.getSize().height - 50;
          }
        } catch (segmentError) {
          console.error('Error processing segment:', segmentError);
          continue;
        }
      }
    }

    // Add page numbers
    const pageCount = pdfDoc.getPageCount();
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