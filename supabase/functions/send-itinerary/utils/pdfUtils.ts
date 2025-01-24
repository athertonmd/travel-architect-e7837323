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
    // Fetch the image
    const imageResponse = await fetch("https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/28ce9083-1b5c-4ba8-96e5-fc42a3220744.png");
    if (!imageResponse.ok) {
      console.error('Failed to fetch header image:', imageResponse.statusText);
      return page.getSize().height - 50; // Return default Y position if image fetch fails
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    
    // Try to embed as PNG first, then JPG if that fails
    let headerImage;
    try {
      headerImage = await pdfDoc.embedPng(imageBytes);
    } catch {
      try {
        headerImage = await pdfDoc.embedJpg(imageBytes);
      } catch (embedError) {
        console.error('Failed to embed image:', embedError);
        return page.getSize().height - 50;
      }
    }
    
    const { width } = page.getSize();
    const imgWidth = 515; // Fixed width with proper margins
    const imgHeight = 90; // Adjusted height for the new image
    const xMargin = (width - imgWidth) / 2; // Center the image horizontally
    const yPosition = page.getSize().height - imgHeight - 40; // Position from top
    
    // Draw the image
    page.drawImage(headerImage, {
      x: xMargin,
      y: yPosition,
      width: imgWidth,
      height: imgHeight,
    });
    
    // Return the Y position for the next element
    return yPosition - 20; // Add some spacing after the image
  } catch (error) {
    console.error('Error in embedHeaderImage:', error);
    return page.getSize().height - 50; // Return default Y position if anything fails
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