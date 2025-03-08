import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { drawText, drawDivider, createBasePDF, addHeader, drawSectionHeader, drawDetailRow } from "./utils/pdfUtils.ts";

interface PdfSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headerFont?: string;
  bodyFont?: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  showPageNumbers?: boolean;
  includeNotes?: boolean;
  includeContactInfo?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  companyName?: string;
  headerText?: string;
  footerText?: string;
}

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  return rgb(r, g, b);
};

export const generatePDF = async (trip: any, settings?: PdfSettings) => {
  console.log("Starting PDF generation for trip:", trip.title);
  console.log("Using custom settings:", settings ? "Yes" : "No");
  
  try {
    const { pdfDoc, page, font, boldFont } = await createBasePDF();
    console.log("Base PDF created successfully");
    
    let yOffset = page.getSize().height - 50;
    
    // Get colors from settings or use defaults
    const primaryColor = settings?.primaryColor ? hexToRgb(settings.primaryColor) : rgb(0.1, 0.2, 0.4);
    const secondaryColor = settings?.secondaryColor ? hexToRgb(settings.secondaryColor) : rgb(0.5, 0.5, 0.8);
    const accentColor = settings?.accentColor ? hexToRgb(settings.accentColor) : rgb(0.6, 0.5, 0.9);

    // Add header with image (either banner or logo)
    console.log("Adding header...");
    
    if (settings?.bannerImageUrl) {
      console.log("Using banner image for header:", settings.bannerImageUrl);
      try {
        // Fetch the banner image
        const response = await fetch(settings.bannerImageUrl);
        if (!response.ok) throw new Error(`Failed to fetch banner image: ${response.status}`);
        const bannerBytes = new Uint8Array(await response.arrayBuffer());
        
        // Embed the image
        const bannerImage = await pdfDoc.embedPng(bannerBytes);
        
        // Get page dimensions
        const { width } = page.getSize();
        
        // Calculate banner dimensions to cover full width
        const bannerHeight = 100; // Fixed height for the banner
        const bannerWidth = width;
        
        // Draw the banner image
        page.drawImage(bannerImage, {
          x: 0,
          y: yOffset - bannerHeight,
          width: bannerWidth,
          height: bannerHeight,
        });
        
        // Add overlay text on top of the banner if company name or header text provided
        let textYPos = yOffset - (bannerHeight / 2);
        
        if (settings.companyName) {
          const headerFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          drawText(page, settings.companyName, width / 2 - 100, textYPos, headerFont, 16, rgb(1, 1, 1)); // White text
          textYPos -= 20;
        }
        
        if (settings.headerText) {
          drawText(page, settings.headerText, width / 2 - 100, textYPos, font, 12, rgb(1, 1, 1)); // White text
        }
        
        // Update yOffset after banner
        yOffset = yOffset - bannerHeight - 20;
      } catch (error) {
        console.error('Error adding banner image:', error);
        // Fallback to regular header if banner fails
        yOffset = await addHeader(pdfDoc, page, font, yOffset, settings);
      }
    } else {
      // Use regular header with logo if no banner
      yOffset = await addHeader(pdfDoc, page, font, yOffset, settings);
    }
    
    console.log("Header added successfully");
    
    // Add trip title
    if (trip.title) {
      console.log("Adding trip title:", trip.title);
      drawText(page, trip.title, 50, yOffset, boldFont, 18, primaryColor);
      yOffset -= 30;
    }

    // Add company name if provided
    if (settings?.companyName && !settings?.bannerImageUrl) {
      drawText(page, settings.companyName, 50, yOffset, boldFont, 14, secondaryColor);
      yOffset -= 20;
    }

    // Add trip details section
    console.log("Adding trip details section...");
    yOffset = drawSectionHeader(page, "Trip Details", yOffset, boldFont, primaryColor);

    // Add destination and dates
    if (trip.destination) {
      yOffset = drawDetailRow(page, "Destination", trip.destination, yOffset, font, boldFont);
    }
    
    if (trip.start_date || trip.end_date) {
      let dateText = "";
      
      // Format dates according to settings
      if (settings?.dateFormat === "DD/MM/YYYY") {
        dateText = `${trip.start_date?.split('-').reverse().join('/') || 'TBD'} - ${trip.end_date?.split('-').reverse().join('/') || 'TBD'}`;
      } else if (settings?.dateFormat === "YYYY-MM-DD") {
        dateText = `${trip.start_date || 'TBD'} - ${trip.end_date || 'TBD'}`;
      } else {
        // Default MM/DD/YYYY
        const formatDate = (dateStr: string) => {
          if (!dateStr) return 'TBD';
          const [year, month, day] = dateStr.split('-');
          return `${month}/${day}/${year}`;
        };
        dateText = `${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`;
      }
      
      yOffset = drawDetailRow(page, "Dates", dateText, yOffset, font, boldFont);
    }

    yOffset -= 20;

    // Process segments
    if (Array.isArray(trip.segments)) {
      console.log("Processing trip segments...");
      for (const segment of trip.segments) {
        if (!segment?.type) continue;
        
        // Skip notes if includeNotes is false
        if (segment.type.toLowerCase() === "notes" && settings?.includeNotes === false) {
          console.log("Skipping notes segment due to settings");
          continue;
        }

        // Check if we need a new page
        if (yOffset < 100) {
          console.log("Adding new page...");
          page = pdfDoc.addPage();
          yOffset = page.getSize().height - 50;
        }

        console.log("Adding segment:", segment.type);
        yOffset = drawSectionHeader(page, segment.type.toUpperCase(), yOffset, boldFont, primaryColor);

        if (segment.details && typeof segment.details === 'object') {
          for (const [key, value] of Object.entries(segment.details)) {
            // Skip contact info if includeContactInfo is false
            if (settings?.includeContactInfo === false && 
                (key.toLowerCase().includes('contact') || 
                 key.toLowerCase().includes('phone') || 
                 key.toLowerCase().includes('email'))) {
              continue;
            }
            
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

    // Add custom footer text if provided
    if (settings?.footerText) {
      // Footer appears on every page
      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const currentPage = pdfDoc.getPage(i);
        drawText(
          currentPage,
          settings.footerText,
          currentPage.getSize().width / 2 - 100,
          30,
          font,
          10,
          rgb(0.5, 0.5, 0.5)
        );
      }
    }

    // Add page numbers if showPageNumbers is true or undefined (default)
    if (settings?.showPageNumbers !== false) {
      console.log("Adding page numbers...");
      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const currentPage = pdfDoc.getPage(i);
        drawText(
          currentPage,
          `Page ${i + 1} of ${pageCount}`,
          currentPage.getSize().width / 2 - 30,
          15,
          font,
          10,
          rgb(0.5, 0.5, 0.5)
        );
      }
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
