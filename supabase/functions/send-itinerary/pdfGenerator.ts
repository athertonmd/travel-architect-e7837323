import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { drawText, drawDivider, createBasePDF, addHeader, drawSectionHeader, drawDetailRow } from "./utils/pdfUtils.ts";

export const generatePDF = async (trip: any) => {
  console.log("Starting PDF generation for trip:", trip.title);
  
  try {
    const { pdfDoc, page, font, boldFont } = await createBasePDF();
    console.log("Base PDF created successfully");
    
    let yOffset = page.getSize().height - 50;

    // Add header with image
    console.log("Adding header...");
    yOffset = await addHeader(pdfDoc, page, font, yOffset);
    console.log("Header added successfully");
    
    // Add trip title
    if (trip.title) {
      console.log("Adding trip title:", trip.title);
      drawText(page, trip.title, 50, yOffset, boldFont, 18, rgb(0.1, 0.2, 0.4));
      yOffset -= 30;
    }

    // Add trip details section
    console.log("Adding trip details section...");
    yOffset = drawSectionHeader(page, "Trip Details", yOffset, boldFont);

    // Add destination and dates
    if (trip.destination) {
      yOffset = drawDetailRow(page, "Destination", trip.destination, yOffset, font, boldFont);
    }
    
    if (trip.start_date || trip.end_date) {
      const dateText = `${trip.start_date || 'TBD'} - ${trip.end_date || 'TBD'}`;
      yOffset = drawDetailRow(page, "Dates", dateText, yOffset, font, boldFont);
    }

    yOffset -= 20;

    // Process segments
    if (Array.isArray(trip.segments)) {
      console.log("Processing trip segments...");
      for (const segment of trip.segments) {
        if (!segment?.type) continue;

        // Check if we need a new page
        if (yOffset < 100) {
          console.log("Adding new page...");
          page = pdfDoc.addPage();
          yOffset = page.getSize().height - 50;
        }

        console.log("Adding segment:", segment.type);
        yOffset = drawSectionHeader(page, segment.type.toUpperCase(), yOffset, boldFont);

        if (segment.details && typeof segment.details === 'object') {
          for (const [key, value] of Object.entries(segment.details)) {
            if (value && typeof value !== 'object') {
              const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
              yOffset = drawDetailRow(page, label, String(value), yOffset, font, boldFont);
            }
          }
        }

        yOffset -= 20;
      }
      console.log("All segments processed successfully");
    }

    // Add page numbers
    console.log("Adding page numbers...");
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const currentPage = pdfDoc.getPage(i);
      drawText(
        currentPage,
        `Page ${i + 1} of ${pageCount}`,
        currentPage.getSize().width / 2 - 30,
        30,
        font,
        10,
        rgb(0.5, 0.5, 0.5)
      );
    }

    console.log("Saving PDF document...");
    const pdfBytes = await pdfDoc.save();
    console.log("PDF document saved successfully, size:", pdfBytes.length, "bytes");
    return pdfBytes;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};