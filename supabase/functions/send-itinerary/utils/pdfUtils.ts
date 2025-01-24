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
    console.log('Starting header image embedding process...');
    
    // Fetch the image
    const imageUrl = "https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/28ce9083-1b5c-4ba8-96e5-fc42a3220744.png";
    console.log('Attempting to fetch image from:', imageUrl);
    
    const imageResponse = await fetch(imageUrl);
    console.log('Image fetch response status:', imageResponse.status);
    
    if (!imageResponse.ok) {
      console.error('Failed to fetch header image:', imageResponse.statusText);
      return page.getSize().height - 50;
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    console.log('Image bytes length:', imageBytes.length);
    
    // Try to embed as PNG first, then JPG if that fails
    let headerImage;
    try {
      console.log('Attempting to embed as PNG...');
      headerImage = await pdfDoc.embedPng(imageBytes);
      console.log('Successfully embedded as PNG');
    } catch (pngError) {
      console.log('PNG embedding failed, attempting JPG...', pngError);
      try {
        headerImage = await pdfDoc.embedJpg(imageBytes);
        console.log('Successfully embedded as JPG');
      } catch (jpgError) {
        console.error('Failed to embed as both PNG and JPG:', jpgError);
        return page.getSize().height - 50;
      }
    }
    
    const { width, height } = page.getSize();
    console.log('Page dimensions:', { width, height });
    
    const imgWidth = 515;
    const imgHeight = 90;
    const xMargin = (width - imgWidth) / 2;
    const yPosition = height - imgHeight - 40;
    
    console.log('Image placement details:', {
      x: xMargin,
      y: yPosition,
      width: imgWidth,
      height: imgHeight
    });
    
    // Draw the image
    page.drawImage(headerImage, {
      x: xMargin,
      y: yPosition,
      width: imgWidth,
      height: imgHeight,
    });
    
    console.log('Image drawing completed');
    return yPosition - 20;
  } catch (error) {
    console.error('Detailed error in embedHeaderImage:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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