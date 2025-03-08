
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawText, addHeader } from "../utils/pdfUtils.ts";

export const addHeaderSection = async (pdfDoc: any, page: any, font: any, boldFont: any, yOffset: number, settings?: PdfSettings) => {
  console.log("Adding header section...");
  let currentY = yOffset;
  
  // Get colors from settings or use defaults
  const primaryColor = settings?.primaryColor ? 
    hexToRgb(settings.primaryColor) : rgb(0.1, 0.2, 0.4);
    
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
        const headerFont = await pdfDoc.embedFont('Helvetica-Bold');
        drawText(page, settings.companyName, width / 2 - 100, textYPos, headerFont, 16, rgb(1, 1, 1)); // White text
        textYPos -= 20;
      }
      
      if (settings.headerText) {
        drawText(page, settings.headerText, width / 2 - 100, textYPos, font, 12, rgb(1, 1, 1)); // White text
      }
      
      // Update yOffset after banner
      currentY = yOffset - bannerHeight - 20;
    } catch (error) {
      console.error('Error adding banner image:', error);
      // Fallback to regular header if banner fails
      currentY = await addHeader(pdfDoc, page, font, currentY, settings);
    }
  } else {
    // Use regular header with logo if no banner
    currentY = await addHeader(pdfDoc, page, font, currentY, settings);
  }
  
  console.log("Header section added successfully");
  return currentY;
};

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
