import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createBasePDF = async () => {
  try {
    console.log('Creating base PDF document...');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    console.log('Base PDF document created successfully');
    return { pdfDoc, page, font };
  } catch (error) {
    console.error('Error creating base PDF:', error);
    throw new Error('Failed to create base PDF document');
  }
};

export const embedHeaderImage = async (pdfDoc: any, page: any) => {
  try {
    console.log('Starting header image embedding process...');
    const { width, height } = page.getSize();
    const yPosition = height - 100;
    
    // Skip header image for now to simplify the process
    console.log('Header image embedding skipped');
    return yPosition;
  } catch (error) {
    console.error('Error in embedHeaderImage:', error);
    // Return a default Y position if header image fails
    return page.getSize().height - 100;
  }
};

export const drawText = (page: any, text: string, x: number, y: number, font: any, fontSize: number) => {
  try {
    if (typeof text !== 'string') {
      text = String(text);
    }
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  } catch (error) {
    console.error('Error drawing text:', error);
    throw error;
  }
};

export const drawDivider = (page: any, y: number) => {
  try {
    const { width } = page.getSize();
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0, 0, 0.8),
    });
  } catch (error) {
    console.error('Error drawing divider:', error);
    throw error;
  }
};