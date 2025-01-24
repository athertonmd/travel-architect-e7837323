import { drawText, drawDivider } from "../utils/pdfUtils.ts";

const sanitizeDetails = (details: any) => {
  if (!details || typeof details !== 'object') {
    return {};
  }
  
  const sanitized: Record<string, string | number | boolean> = {};
  
  for (const [key, value] of Object.entries(details)) {
    if (value !== null && value !== undefined) {
      sanitized[key] = String(value);
    }
  }
  
  return sanitized;
};

export const addSegment = async (page: any, segment: any, yOffset: number, font: any) => {
  console.log('Adding segment to PDF...');
  const fontSize = 12;
  const lineHeight = 20;
  let currentY = yOffset;

  try {
    const segmentType = String(segment.type || 'Unknown').toUpperCase();
    console.log(`Processing segment of type: ${segmentType}`);
    
    drawText(page, segmentType, 50, currentY, font, fontSize + 2);
    currentY -= lineHeight * 1.5;

    const safeDetails = sanitizeDetails(segment.details);
    
    for (const [key, value] of Object.entries(safeDetails)) {
      if (value && typeof value === 'string' && value.trim() !== '') {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        drawText(page, `${label}: ${value}`, 70, currentY, font, fontSize);
        currentY -= lineHeight;
      }
    }

    currentY -= lineHeight;
    drawDivider(page, currentY);
    currentY -= lineHeight;

    console.log('Segment added successfully');
    return currentY;
  } catch (error) {
    console.error('Error adding segment:', error);
    throw new Error(`Failed to add segment: ${error.message}`);
  }
};