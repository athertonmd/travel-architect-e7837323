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
    const imageResponse = await fetch("https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/24cd14b4-83c7-4191-8479-3504ce16720b.png");
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    
    let headerImage;
    try {
      headerImage = await pdfDoc.embedJpg(imageBytes);
    } catch {
      headerImage = await pdfDoc.embedPng(imageBytes);
    }
    
    const { width } = page.getSize();
    const imgWidth = width - 40; // Slightly wider margins for better fit
    const imgHeight = 180; // Increased height for the landscape image
    
    page.drawImage(headerImage, {
      x: 20,
      y: page.getSize().height - imgHeight - 30,
      width: imgWidth,
      height: imgHeight,
    });
    
    return page.getSize().height - imgHeight - 60; // Adjusted spacing after header
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