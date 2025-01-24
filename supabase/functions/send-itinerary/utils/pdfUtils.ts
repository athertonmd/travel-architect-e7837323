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

export const embedHeaderImage = async (pdfDoc: any, page: any) => {
  try {
    const imageResponse = await fetch("https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/eea4357d-4c1b-4221-9da7-35dd2344a1f8.png");
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    
    let headerImage;
    try {
      headerImage = await pdfDoc.embedPng(imageBytes);
    } catch {
      headerImage = await pdfDoc.embedJpg(imageBytes);
    }
    
    const { width } = page.getSize();
    const imgWidth = width - 100; // Margins on both sides
    const imgHeight = 100; // Fixed height for header
    
    page.drawImage(headerImage, {
      x: 50,
      y: page.getSize().height - imgHeight - 50,
      width: imgWidth,
      height: imgHeight,
    });
    
    return page.getSize().height - imgHeight - 100;
  } catch (error) {
    console.error('Error embedding header image:', error);
    return page.getSize().height - 50;
  }
};

export const drawText = (page: any, text: string, x: number, y: number, font: any, fontSize: number) => {
  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0), // Using rgb helper from pdf-lib
  });
};

export const drawDivider = (page: any, y: number) => {
  const { width } = page.getSize();
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0, 0, 0.8), // Using rgb helper from pdf-lib
  });
};