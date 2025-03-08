
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { PdfSettings } from "../types/pdfTypes.ts";

// Re-export all utilities from the modular files
export { corsHeaders, createBasePDF } from "./pdfBaseUtils.ts";
export { drawText, drawDivider, drawSectionHeader, drawDetailRow } from "./textUtils.ts";
export { addHeader } from "./headerUtils.ts";

// This ensures backwards compatibility with existing code
