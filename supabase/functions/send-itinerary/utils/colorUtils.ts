
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

// Helper function to convert hex color to RGB
export const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  return rgb(r, g, b);
};

// Get colors from settings or use defaults
export const getColors = (settings?: { 
  primaryColor?: string; 
  secondaryColor?: string; 
  accentColor?: string; 
}) => {
  return {
    primaryColor: settings?.primaryColor ? hexToRgb(settings.primaryColor) : rgb(0.1, 0.2, 0.4),
    secondaryColor: settings?.secondaryColor ? hexToRgb(settings.secondaryColor) : rgb(0.5, 0.5, 0.8),
    accentColor: settings?.accentColor ? hexToRgb(settings.accentColor) : rgb(0.6, 0.5, 0.9)
  };
};
