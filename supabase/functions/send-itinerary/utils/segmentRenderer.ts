
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawDetailRow } from "./pdfUtils.ts";
import { getFieldMapping } from "./segmentMappings.ts";
import { formatDateTime } from "./dateUtils.ts";

// Process and render a single segment's details
export const renderSegmentDetails = (
  currentPage: any, 
  segment: any, 
  currentY: number, 
  font: any, 
  boldFont: any, 
  settings?: PdfSettings
): number => {
  let updatedY = currentY;
  
  // Skip if no details or invalid details
  if (!segment.details || typeof segment.details !== 'object') {
    console.log(`No details or invalid details for segment ${segment.type}`);
    return updatedY;
  }
  
  // Get field mapping for this segment type
  const fieldMapping = getFieldMapping(segment.type);
  
  // Debug the segment details and field mapping
  console.log(`Segment details for ${segment.type}:`, Object.keys(segment.details));
  console.log(`Field mapping for ${segment.type}:`, fieldMapping);
  
  // Process fields based on mapping or fallback to all fields if no mapping exists
  if (Object.keys(fieldMapping).length > 0) {
    updatedY = renderMappedFields(currentPage, segment, fieldMapping, updatedY, font, boldFont, settings);
  } else {
    updatedY = renderAllFields(currentPage, segment, updatedY, font, boldFont, settings);
  }
  
  return updatedY;
};

// Render fields based on predefined mapping
const renderMappedFields = (
  currentPage: any, 
  segment: any, 
  fieldMapping: Record<string, string>, 
  currentY: number, 
  font: any, 
  boldFont: any, 
  settings?: PdfSettings
): number => {
  let updatedY = currentY;
  
  for (const [key, label] of Object.entries(fieldMapping)) {
    // Skip if value doesn't exist in details
    if (!(key in segment.details)) continue;
    
    const value = segment.details[key];
    
    // Skip null, undefined, empty strings and objects
    if (value === null || value === undefined || value === '' || typeof value === 'object') {
      continue;
    }
    
    // Skip contact info if includeContactInfo is false
    if (settings?.includeContactInfo === false && 
        (key.toLowerCase().includes('contact') || 
         key.toLowerCase().includes('phone') || 
         key.toLowerCase().includes('email'))) {
      continue;
    }
    
    // Format date fields
    let displayValue = String(value);
    if (key.toLowerCase().includes('date')) {
      displayValue = formatDateTime(displayValue, true);
    } else if (key.toLowerCase().includes('time')) {
      displayValue = formatDateTime(displayValue, false);
    }
    
    try {
      updatedY = drawDetailRow(currentPage, label, displayValue, updatedY, font, boldFont);
    } catch (err) {
      console.error(`Error drawing detail row for ${label}: ${err}`);
      // Continue with next detail instead of breaking the entire PDF generation
    }
  }
  
  return updatedY;
};

// Fallback to rendering all fields if no mapping exists
const renderAllFields = (
  currentPage: any, 
  segment: any, 
  currentY: number, 
  font: any, 
  boldFont: any, 
  settings?: PdfSettings
): number => {
  let updatedY = currentY;
  
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
      try {
        updatedY = drawDetailRow(currentPage, label, String(value), updatedY, font, boldFont);
      } catch (err) {
        console.error(`Error drawing detail row for ${label}: ${err}`);
        // Continue with next detail instead of breaking the entire PDF generation
      }
    } else if (value !== null && typeof value === 'object') {
      // Log complex objects but skip them in the PDF
      console.log(`Skipping complex object for ${key}:`, value);
    }
  }
  
  return updatedY;
};
