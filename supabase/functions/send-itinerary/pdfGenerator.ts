
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";
import { PdfSettings, TripData } from "./types/pdfTypes.ts";
import { getColors } from "./utils/colorUtils.ts";
import { createBasePDF } from "./utils/pdfBaseUtils.ts";
import { addHeaderSection } from "./sections/headerSection.ts";
import { addTripDetailsSection } from "./sections/tripDetailsSection.ts";
import { processSegments } from "./sections/segmentsSection.ts";
import { addQuickLinksSection } from "./sections/quickLinksSection.ts";
import { addFooterAndPageNumbers } from "./sections/footerSection.ts";

export const generatePDF = async (trip: TripData, settings?: PdfSettings) => {
  console.log("Starting PDF generation for trip:", trip.title);
  console.log("Using custom settings:", settings ? "Yes" : "No");
  
  try {
    // Create the base PDF document
    const { pdfDoc, page, font, boldFont } = await createBasePDF();
    console.log("Base PDF created successfully");
    
    // Initial Y position from the top of the page
    let yOffset = page.getSize().height - 50;
    
    // Get colors from settings or use defaults
    const colors = getColors(settings);
    
    // 1. Add header section (with logo or banner)
    yOffset = await addHeaderSection(pdfDoc, page, font, boldFont, yOffset, settings);
    console.log("Header added successfully");
    
    // 2. Add trip details section
    yOffset = addTripDetailsSection(page, trip, colors, yOffset, font, boldFont, settings);
    
    // 3. Process all segments
    const { currentPage, currentY } = processSegments(pdfDoc, page, trip, colors, yOffset, font, boldFont, settings);
    yOffset = currentY;
    
    // 4. Add quick links section if included
    if (settings?.includeQuickLinks !== false) {
      yOffset = addQuickLinksSection(currentPage, colors, yOffset, font, boldFont, settings);
    }
    
    // 5. Add footer and page numbers
    addFooterAndPageNumbers(pdfDoc, font, settings);

    console.log("Saving PDF document...");
    const pdfBytes = await pdfDoc.save();
    console.log("PDF document saved successfully, size:", pdfBytes.length, "bytes");
    return pdfBytes;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};
