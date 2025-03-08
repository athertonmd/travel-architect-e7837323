
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

export const drawText = (page: any, text: string, x: number, y: number, font: any, fontSize: number, color = rgb(0, 0, 0)) => {
  if (!text || !page || !font) {
    console.warn("Missing required parameters for drawText");
    return;
  }
  
  try {
    const safeText = String(text).trim();
    if (!safeText) return;

    page.drawText(safeText, {
      x: Math.max(0, x),
      y: Math.max(0, y),
      size: Math.max(1, fontSize),
      font,
      color,
    });
  } catch (error) {
    console.error("Error drawing text:", error);
    throw error;
  }
};

export const drawDivider = (page: any, y: number, width = 495, color = rgb(0.8, 0.8, 0.8)) => {
  if (!page || y < 0) {
    console.warn("Invalid parameters for drawDivider");
    return;
  }
  
  try {
    const pageWidth = page.getSize().width;
    const startX = (pageWidth - width) / 2;
    
    page.drawLine({
      start: { x: startX, y },
      end: { x: startX + width, y },
      thickness: 0.5,
      color,
    });
  } catch (error) {
    console.error("Error drawing divider:", error);
    throw error;
  }
};

// Function to draw a section header
export const drawSectionHeader = (page: any, text: string, y: number, font: any, color = rgb(0.1, 0.2, 0.4)) => {
  console.log("Drawing section header:", text);
  
  // Draw section header text
  drawText(page, text, 50, y, font, 14, color);
  
  // Draw divider under section header
  drawDivider(page, y - 10);
  
  return y - 30; // Return new Y position after header
};

// Function to draw a detail row
export const drawDetailRow = (page: any, label: string, value: string, y: number, font: any, boldFont: any) => {
  if (!label || !value) return y;
  
  try {
    drawText(page, label + ":", 70, y, boldFont, 10, rgb(0.3, 0.3, 0.3));
    drawText(page, value, 200, y, font, 10, rgb(0, 0, 0));
    return y - 20; // Return new Y position after row
  } catch (error) {
    console.error("Error drawing detail row:", { label, value, error });
    return y;
  }
};
