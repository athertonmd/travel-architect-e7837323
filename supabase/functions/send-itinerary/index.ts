import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generatePDF } from "./pdfGenerator.ts";

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
  generatePdfOnly?: boolean;
}

const sanitizeSegments = (segments: any) => {
  try {
    // If segments is a string, try to parse it
    const parsedSegments = typeof segments === 'string' ? JSON.parse(segments) : segments;
    
    // If not an array, return empty array
    if (!Array.isArray(parsedSegments)) {
      console.log('Segments is not an array, returning empty array');
      return [];
    }
    
    // Map only the essential properties
    return parsedSegments.map(segment => {
      const sanitized = {
        id: segment.id || crypto.randomUUID(),
        type: segment.type || 'unknown',
        icon: segment.icon || '📍',
        details: {},
        position: { x: 0, y: 0 }
      };

      // Safely copy details if they exist
      if (segment.details && typeof segment.details === 'object') {
        sanitized.details = { ...segment.details };
      }

      // Safely copy position if it exists
      if (segment.position && typeof segment.position === 'object') {
        sanitized.position = {
          x: Number(segment.position.x) || 0,
          y: Number(segment.position.y) || 0
        };
      }

      return sanitized;
    });
  } catch (error) {
    console.error('Error sanitizing segments:', error);
    return [];
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-itinerary function");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    const { tripId, to, generatePdfOnly = false }: EmailRequest = await req.json();
    
    console.log("Fetching trip details for ID:", tripId);
    
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError) {
      console.error("Error fetching trip:", tripError);
      throw tripError;
    }

    // Create a clean copy of the trip data
    const cleanTrip = {
      ...trip,
      segments: sanitizeSegments(trip.segments)
    };

    console.log("Sanitized trip data:", JSON.stringify(cleanTrip, null, 2));

    if (generatePdfOnly) {
      console.log("Generating PDF only");
      try {
        const pdfBytes = await generatePDF(cleanTrip);
        const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
        
        return new Response(
          JSON.stringify({ pdf: pdfBase64 }), 
          { 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        );
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        return new Response(
          JSON.stringify({ 
            error: {
              message: "Failed to generate PDF",
              details: pdfError.message
            }
          }), 
          { 
            status: 500,
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        );
      }
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured properly");
    }

    if (!to || !Array.isArray(to) || to.length === 0) {
      throw new Error("No recipients specified");
    }

    const ALLOWED_TEST_EMAIL = "athertonmd@gmail.com";
    if (to.some(email => email !== ALLOWED_TEST_EMAIL)) {
      throw {
        name: "validation_error",
        statusCode: 403,
        message: `You can only send testing emails to your own email address (${ALLOWED_TEST_EMAIL}). To send emails to other recipients, please verify a domain at resend.com/domains, and change the 'from' address to an email using this domain.`
      };
    }

    const html = `
      <h1>Trip Itinerary: ${cleanTrip.title}</h1>
      <p>Destination: ${cleanTrip.destination || 'Not specified'}</p>
      <p>Start Date: ${cleanTrip.start_date || 'Not specified'}</p>
      <p>End Date: ${cleanTrip.end_date || 'Not specified'}</p>
      <p>Number of Travelers: ${cleanTrip.travelers}</p>
      
      <h2>Segments:</h2>
      ${cleanTrip.segments ? JSON.stringify(cleanTrip.segments, null, 2) : 'No segments added yet'}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Trip Itinerary <onboarding@resend.dev>",
        to,
        subject: `Trip Itinerary: ${cleanTrip.title}`,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error from Resend API:", error);
      return new Response(error, {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-itinerary function:", error);
    return new Response(JSON.stringify({ 
      error: {
        name: error.name || "unknown_error",
        statusCode: error.statusCode || 500,
        message: error.message || "An unexpected error occurred",
      }
    }), {
      status: error.statusCode || 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);