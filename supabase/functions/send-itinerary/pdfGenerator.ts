import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

export const generatePDF = async (trip: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  
  // Fetch and embed the header image
  const imageResponse = await fetch("https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/eea4357d-4c1b-4221-9da7-35dd2344a1f8.png");
  const imageArrayBuffer = await imageResponse.arrayBuffer();
  const headerImage = await pdfDoc.embedPng(new Uint8Array(imageArrayBuffer));
  
  // Calculate image dimensions to maintain aspect ratio
  const imgDims = headerImage.scale(0.5); // Scale down the image
  const imgWidth = Math.min(width - 100, imgDims.width);
  const imgHeight = (imgDims.height * imgWidth) / imgDims.width;
  
  // Draw the header image
  page.drawImage(headerImage, {
    x: (width - imgWidth) / 2,
    y: height - imgHeight - 50,
    width: imgWidth,
    height: imgHeight,
  });
  
  let yOffset = height - imgHeight - 100; // Adjust starting position after image
  const lineHeight = 20;
  
  // Add title
  page.drawText(`Trip Itinerary: ${trip.title}`, {
    x: 50,
    y: yOffset,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });
  yOffset -= lineHeight * 2;

  // Add destination if available
  if (trip.destination) {
    page.drawText(`Destination: ${trip.destination}`, {
      x: 50,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yOffset -= lineHeight;
  }

  // Add dates if available
  if (trip.start_date || trip.end_date) {
    const dateText = `Date: ${trip.start_date || ''} ${trip.end_date ? `to ${trip.end_date}` : ''}`;
    page.drawText(dateText, {
      x: 50,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    yOffset -= lineHeight * 2;
  }

  // Add segments
  const segments = typeof trip.segments === 'string' 
    ? JSON.parse(trip.segments) 
    : trip.segments;

  if (segments && segments.length > 0) {
    page.drawText('Itinerary Details:', {
      x: 50,
      y: yOffset,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    yOffset -= lineHeight * 1.5;

    for (const segment of segments) {
      yOffset = await addSegmentToPDF(page, segment, yOffset, font, fontSize, lineHeight);
      
      // Check if we need a new page
      if (yOffset < 50) {
        const newPage = pdfDoc.addPage();
        yOffset = newPage.getSize().height - 50;
      }
    }
  }

  return pdfDoc.save();
};

const addSegmentToPDF = async (page: any, segment: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  // Add segment type
  page.drawText(`${segment.type.toUpperCase()}`, {
    x: 50,
    y: yOffset,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  yOffset -= lineHeight;

  // Add segment details
  if (segment.details) {
    const details = segment.details;
    
    // Common details
    if (details.date) {
      page.drawText(`Date: ${details.date}`, {
        x: 70,
        y: yOffset,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yOffset -= lineHeight;
    }
    
    if (details.time) {
      page.drawText(`Time: ${details.time}`, {
        x: 70,
        y: yOffset,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      yOffset -= lineHeight;
    }

    // Specific details based on segment type
    yOffset = await addTypeSpecificDetails(page, segment, details, yOffset, font, fontSize, lineHeight);
    
    // Add a space between segments
    yOffset -= lineHeight;
  }

  return yOffset;
};

const addTypeSpecificDetails = async (page: any, segment: any, details: any, yOffset: number, font: any, fontSize: number, lineHeight: number) => {
  switch (segment.type) {
    case 'flight':
      if (details.departureAirport) {
        page.drawText(`From: ${details.departureAirport}`, {
          x: 70,
          y: yOffset,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight;
      }
      if (details.destinationAirport) {
        page.drawText(`To: ${details.destinationAirport}`, {
          x: 70,
          y: yOffset,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight;
      }
      break;
    
    case 'hotel':
      if (details.hotelName) {
        page.drawText(`Hotel: ${details.hotelName}`, {
          x: 70,
          y: yOffset,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight;
      }
      if (details.checkInDate) {
        page.drawText(`Check-in: ${details.checkInDate}`, {
          x: 70,
          y: yOffset,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight;
      }
      break;
  }
  
  return yOffset;
};
