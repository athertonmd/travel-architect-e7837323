
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawText, drawSectionHeader } from "../utils/pdfUtils.ts";

const DEFAULT_LINKS = [
  { name: "Company Portal", url: "#" },
  { name: "Weather", url: "https://weather.com" },
  { name: "Visa & Passport", url: "https://travel.state.gov" },
  { name: "Currency Converter", url: "https://xe.com" },
  { name: "World Clock", url: "https://worldtimebuddy.com" },
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
  
  // Get custom links if provided, otherwise use defaults
  const links = settings?.quick_links || DEFAULT_LINKS;
  
  // Draw quick links
  links.forEach((link, index) => {
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
    
    // Link text - now ensure we use the actual URL
    const linkName = link.name || "Link";
    const linkUrl = link.url || "#";
    
    // Draw the link text
    drawText(page, linkName, x + 25, currentY, font, 11, rgb(0.1, 0.1, 0.1));
    
    // Store annotation for the link (this may or may not work depending on the PDF reader)
    try {
      page.node.Annots = page.node.Annots || [];
      const annot = {
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, currentY - 20, x + columnWidth - 10, currentY + 5],
        Border: [0, 0, 0],
        A: {
          Type: "Action",
          S: "URI",
          URI: linkUrl
        }
      };
      page.node.Annots.push(annot);
    } catch (error) {
      console.error("Error adding link annotation:", error);
    }
    
    // Move to next row after every 2 items
    if (column === columns - 1) {
      currentY -= 30;
    }
  });
  
  // Ensure we move down if the last row wasn't complete
  if (links.length % columns !== 0) {
    currentY -= 30;
  }
  
  // Extra spacing after the section
  currentY -= 20;
  
  console.log("Quick Links section added successfully");
  return currentY;
};
