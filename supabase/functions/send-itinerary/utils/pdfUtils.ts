import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createBasePDF = async () => {
  try {
    console.log('Creating base PDF document...');
    const pdfDoc = await PDFDocument.create();
    if (!pdfDoc) throw new Error('Failed to create PDF document');
    
    const page = pdfDoc.addPage([595, 842]); // A4 size
    if (!page) throw new Error('Failed to add page to PDF');
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    if (!font) throw new Error('Failed to embed font');
    
    console.log('Base PDF document created successfully');
    return { pdfDoc, page, font };
  } catch (error) {
    console.error('Error creating base PDF:', error);
    throw new Error('Failed to create base PDF document');
  }
};

// Base64 encoded small placeholder logo
const HEADER_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAABACAYAAABMbHjfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMjRUMTg6NDc6NDcrMDA6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMjRUMTg6NDc6NDcrMDA6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTI0VDE4OjQ3OjQ3KzAwOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1MGZiMjM5LTVkMGUtNDc0ZC1hMzBkLTU0OWNhMjk0ZjM0YyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjA4ZjJiOWM5LTM5ZDAtYjU0OC1hNmQ2LTEyZDM3ZmQ5ZjI0OCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjMwZWM1ZDM5LWU3ZTctNDU0MS05MzVjLTNhOTBkNzgwZDQ0ZiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjMwZWM1ZDM5LWU3ZTctNDU0MS05MzVjLTNhOTBkNzgwZDQ0ZiIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0yNFQxODo0Nzo0NyswMDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA1MGZiMjM5LTVkMGUtNDc0ZC1hMzBkLTU0OWNhMjk0ZjM0YyIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0yNFQxODo0Nzo0NyswMDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+wZXPWAAAABJJREFUeJztwTEBAAAAwqD1T20ND6AAAAA+BgyAAAFsd0XxAAAAAElFTkSuQmCC';

export const embedHeaderImage = async (pdfDoc: any, page: any) => {
  if (!pdfDoc || !page) {
    console.error('Invalid PDF document or page');
    return page.getSize().height - 100;
  }

  try {
    console.log('Starting header image embedding process...');
    const { width, height } = page.getSize();
    const yPosition = height - 100;

    if (!HEADER_IMAGE_BASE64) {
      console.warn('No header image data available');
      return yPosition;
    }

    // Decode and embed the base64 image
    const imageBytes = Uint8Array.from(atob(HEADER_IMAGE_BASE64), c => c.charCodeAt(0));
    if (!imageBytes.length) {
      console.error('Failed to decode image data');
      return yPosition;
    }

    const headerImage = await pdfDoc.embedPng(imageBytes);
    if (!headerImage) {
      console.error('Failed to embed image');
      return yPosition;
    }

    // Calculate dimensions to maintain aspect ratio
    const imgDims = headerImage.scale(0.5); // Scale down the image
    const xPosition = (width - imgDims.width) / 2; // Center horizontally

    // Draw the image with error handling
    try {
      page.drawImage(headerImage, {
        x: xPosition,
        y: yPosition,
        width: imgDims.width,
        height: imgDims.height,
      });
      console.log('Header image embedded successfully');
    } catch (drawError) {
      console.error('Error drawing image:', drawError);
      return yPosition;
    }

    return yPosition - imgDims.height - 20; // Return Y position for next content
  } catch (error) {
    console.error('Error in embedHeaderImage:', error);
    return page.getSize().height - 100; // Return a default Y position if header image fails
  }
};

export const drawText = (page: any, text: string, x: number, y: number, font: any, fontSize: number) => {
  if (!page || !font) {
    console.error('Invalid page or font');
    return;
  }

  try {
    if (text === null || text === undefined) {
      text = '';
    }
    
    const safeText = String(text).trim();
    if (!safeText) return;

    page.drawText(safeText, {
      x: Math.max(0, x),
      y: Math.max(0, y),
      size: Math.max(1, fontSize),
      font,
      color: rgb(0, 0, 0),
    });
  } catch (error) {
    console.error('Error drawing text:', error);
  }
};

export const drawDivider = (page: any, y: number) => {
  if (!page) {
    console.error('Invalid page');
    return;
  }

  try {
    const { width } = page.getSize();
    if (y < 0 || !width) return;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0, 0, 0.8),
    });
  } catch (error) {
    console.error('Error drawing divider:', error);
  }
};