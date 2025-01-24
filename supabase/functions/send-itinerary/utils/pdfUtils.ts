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
    const imageResponse = await fetch("https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/3d5d9396-0e98-4c13-a4da-15a0d219e9d6.png");
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    
    let headerImage;
    try {
      headerImage = await pdfDoc.embedJpg(imageBytes);
    } catch {
      headerImage = await pdfDoc.embedPng(imageBytes);
    }
    
    const { width } = page.getSize();
    const imgWidth = 515; // Fixed width with proper margins
    const imgHeight = 180; // Height matching the new image dimensions
    const xMargin = (width - imgWidth) / 2; // Center the image horizontally
    
    page.drawImage(headerImage, {
      x: xMargin,
      y: page.getSize().height - imgHeight - 40,
      width: imgWidth,
      height: imgHeight,
    });
    
    // Return the Y position for the next element
    return page.getSize().height - imgHeight - 60;
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
    color: rgb(0, 0, 0),
  });
};

export const drawDivider = (page: any, y: number) => {
  const { width } = page.getSize();
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: rgb(0, 0, 0.8),
  });
};