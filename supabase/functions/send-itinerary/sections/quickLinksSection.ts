
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawText, drawSectionHeader } from "../utils/pdfUtils.ts";

const LINKS = [
  { name: "Company Portal", url: "#" },
  { name: "Weather", url: "#" },
  { name: "Visa & Passport", url: "#" },
  { name: "Currency Converter", url: "#" },
  { name: "World Clock", url: "#" },
];

export const addQuickLinksSection = (page: any, colors: any, yOffset: number, font: any, boldFont: any, settings?: PdfSettings) => {
  console.log("Adding Quick Links section...");

  // Skip if includeQuickLinks is explicitly set to false
  if (settings?.includeQuickLinks === false) {
    console.log("Skipping Quick Links section due to settings");
    return yOffset;
  }

  let currentY = yOffset;
  
  // Add section header
  currentY = drawSectionHeader(page, "QUICK LINKS", currentY, boldFont, colors.primaryColor);
  
  // Calculate positioning for a multi-column layout
  const pageWidth = page.getSize().width;
  const margin = 50;
  const availableWidth = pageWidth - (margin * 2);
  const columns = 2;
  const columnWidth = availableWidth / columns;
  
  // Draw quick links
  LINKS.forEach((link, index) => {
    const column = index % columns;
    const x = margin + (column * columnWidth);
    
    // Icon (colored square)
    page.drawRectangle({
      x,
      y: currentY - 15,
      width: 15,
      height: 15,
      color: colors.primaryColor,
      borderWidth: 0,
    });
    
    // Link text
    drawText(page, link.name, x + 25, currentY, font, 11, rgb(0.1, 0.1, 0.1));
    
    // Move to next row after every 2 items
    if (column === columns - 1) {
      currentY -= 30;
    }
  });
  
  // Ensure we move down if the last row wasn't complete
  if (LINKS.length % columns !== 0) {
    currentY -= 30;
  }
  
  // Extra spacing after the section
  currentY -= 20;
  
  console.log("Quick Links section added successfully");
  return currentY;
};
