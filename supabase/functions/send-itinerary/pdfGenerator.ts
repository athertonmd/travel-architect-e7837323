import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { drawText, drawDivider, createBasePDF, addHeader } from "./utils/pdfUtils.ts";

export const generatePDF = async (trip: any) => {
  try {
    const { pdfDoc, page, font } = await createBasePDF();
    let yOffset = page.getSize().height - 50;

    // Add header with image
    yOffset = await addHeader(pdfDoc, page, font, yOffset);
    
    // Add trip title
    if (trip.title) {
      drawText(page, `Trip: ${trip.title}`, 50, yOffset, font, 14);
      yOffset -= 30;
    }

    // Add destination
    if (trip.destination) {
      drawText(page, `Destination: ${trip.destination}`, 50, yOffset, font, 12);
      yOffset -= 20;
    }

    // Add dates
    if (trip.start_date || trip.end_date) {
      const dateText = `Date: ${trip.start_date || 'TBD'} - ${trip.end_date || 'TBD'}`;
      drawText(page, dateText, 50, yOffset, font, 12);
      yOffset -= 20;
    }

    drawDivider(page, yOffset);
    yOffset -= 20;

    // Process segments
    if (Array.isArray(trip.segments)) {
      for (const segment of trip.segments) {
        if (!segment?.type) continue;

        // Check if we need a new page
        if (yOffset < 50) {
          page = pdfDoc.addPage();
          yOffset = page.getSize().height - 50;
        }

        // Draw segment header
        drawText(page, segment.type.toUpperCase(), 50, yOffset, font, 12);
        yOffset -= 20;

        // Draw segment details
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
      }
    }

    // Add page numbers
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const currentPage = pdfDoc.getPage(i);
      drawText(currentPage, `Page ${i + 1} of ${pageCount}`, 250, 30, font, 10);
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};