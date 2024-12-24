import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  tripId: string;
  to: string[];
}

const generatePDF = async (trip: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  
  let yOffset = height - 50;
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

        // Flight specific details
        if (segment.type === 'flight') {
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
        }

        // Hotel specific details
        if (segment.type === 'hotel') {
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
        }

        // Add a space between segments
        yOffset -= lineHeight;
      }

      // Check if we need a new page
      if (yOffset < 50) {
        const newPage = pdfDoc.addPage();
        yOffset = newPage.getSize().height - 50;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured properly");
    }

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    const { tripId, to }: EmailRequest = await req.json();
    console.log("Processing email request for trip:", tripId, "to recipients:", to);

    // Get the authenticated user's email
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Could not get authenticated user');
    }

    // Fetch trip details
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError) {
      console.error("Error fetching trip:", tripError);
      throw tripError;
    }

    const segments = typeof trip.segments === 'string' 
      ? JSON.parse(trip.segments) 
      : trip.segments;

    const html = formatItinerary(segments);
    const pdfBytes = await generatePDF(trip);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    // Filter recipients to only include the authenticated user's email in development
    const filteredTo = to.filter(email => email === user.email);
    
    if (filteredTo.length === 0) {
      throw new Error("In development mode, you can only send emails to your own email address. Please verify a domain at resend.com/domains to send to other recipients.");
    }

    // Send email using Resend with PDF attachment
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Trip Itinerary <onboarding@resend.dev>",
        to: filteredTo,
        subject: `Trip Itinerary: ${trip.title}`,
        html,
        attachments: [{
          filename: `${trip.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`,
          content: pdfBase64,
        }],
      }),
    });

    const resendResponse = await res.json();
    
    if (!res.ok) {
      console.error("Resend API error:", resendResponse);
      throw new Error(resendResponse.message || "Failed to send email");
    }

    console.log("Email sent successfully:", resendResponse);

    return new Response(JSON.stringify(resendResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-itinerary function:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.response?.data || error.response || error
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

const formatItinerary = (segments: any[]) => {
  let html = '<div style="font-family: Arial, sans-serif;">';
  html += '<h2>Your Trip Itinerary</h2>';
  
  segments.forEach((segment: any, index: number) => {
    html += `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0;">${segment.type.charAt(0).toUpperCase() + segment.type.slice(1)}</h3>
    `;

    if (segment.details) {
      const details = segment.details;
      
      // Common details
      if (details.date) html += `<p><strong>Date:</strong> ${details.date}</p>`;
      if (details.time) html += `<p><strong>Time:</strong> ${details.time}</p>`;
      
      // Flight specific details
      if (segment.type === 'flight') {
        if (details.departureAirport) html += `<p><strong>From:</strong> ${details.departureAirport}</p>`;
        if (details.destinationAirport) html += `<p><strong>To:</strong> ${details.destinationAirport}</p>`;
        if (details.flightNumber) html += `<p><strong>Flight:</strong> ${details.flightNumber}</p>`;
      }
      
      // Hotel specific details
      if (segment.type === 'hotel') {
        if (details.hotelName) html += `<p><strong>Hotel:</strong> ${details.hotelName}</p>`;
        if (details.addressLine1) html += `<p><strong>Address:</strong> ${details.addressLine1}</p>`;
        if (details.checkInDate) html += `<p><strong>Check-in:</strong> ${details.checkInDate}</p>`;
        if (details.checkOutDate) html += `<p><strong>Check-out:</strong> ${details.checkOutDate}</p>`;
      }
      
      // Car/Limo specific details
      if (segment.type === 'car' || segment.type === 'limo') {
        if (details.provider) html += `<p><strong>Provider:</strong> ${details.provider}</p>`;
        if (details.pickupDate) html += `<p><strong>Pickup:</strong> ${details.pickupDate}</p>`;
        if (details.dropoffDate) html += `<p><strong>Drop-off:</strong> ${details.dropoffDate}</p>`;
      }
    }
    
    html += '</div>';
  });
  
  html += '</div>';
  return html;
};

serve(handler);
