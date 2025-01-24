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
    
    const imageUrl = "https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/header1.png";
    console.log('Fetching image from:', imageUrl);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('Failed to fetch header image:', imageResponse.statusText);
      throw new Error('Failed to fetch header image');
    }

    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageArrayBuffer);
    
    let headerImage;
    try {
      headerImage = await pdfDoc.embedPng(imageBytes);
    } catch (pngError) {
      console.log('PNG embedding failed, attempting JPG...', pngError);
      try {
        headerImage = await pdfDoc.embedJpg(imageBytes);
      } catch (jpgError) {
        throw new Error('Failed to embed image in either PNG or JPG format');
      }
    }
    
    const { width, height } = page.getSize();
    const imgWidth = 515;
    const imgHeight = 90;
    const xMargin = (width - imgWidth) / 2;
    const yPosition = height - imgHeight - 40;
    
    page.drawImage(headerImage, {
      x: xMargin,
      y: yPosition,
      width: imgWidth,
      height: imgHeight,
    });
    
    console.log('Header image embedded successfully');
    return yPosition - 20;
  } catch (error) {
    console.error('Error in embedHeaderImage:', error);
    throw error;
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