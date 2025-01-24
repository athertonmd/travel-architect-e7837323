import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createBasePDF = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  return { pdfDoc, page, font };
};

export const drawText = (page: any, text: string, x: number, y: number, font: any, fontSize: number) => {
  if (!text || !page || !font) return;
  
  const safeText = String(text).trim();
  if (!safeText) return;

  page.drawText(safeText, {
    x: Math.max(0, x),
    y: Math.max(0, y),
    size: Math.max(1, fontSize),
    font,
    color: rgb(0, 0, 0),
  });
};

export const drawDivider = (page: any, y: number) => {
  if (!page || y < 0) return;
  
  const { width } = page.getSize();
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0, 0, 0.8),
  });
};

// Simplified header drawing without image
export const addHeader = (page: any, font: any, yPosition: number) => {
  if (!page || !font) return yPosition;
  
  const { width } = page.getSize();
  const text = "Travel Itinerary";
  const fontSize = 24;
  
  drawText(page, text, (width - font.widthOfTextAtSize(text, fontSize)) / 2, yPosition, font, fontSize);
  return yPosition - 40;
};