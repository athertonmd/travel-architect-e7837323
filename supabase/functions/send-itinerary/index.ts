import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generatePDF } from "./pdfGenerator.ts";
import { corsHeaders, createErrorResponse } from "./utils/errorHandler.ts";
import { sendEmail } from "./utils/emailHandler.ts";
import { sanitizeTripData } from "./utils/tripDataHandler.ts";

interface EmailRequest {
  tripId: string;
  to: string[];
  generatePdfOnly?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-itinerary function");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

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

    const cleanTrip = sanitizeTripData(trip);
    console.log("Sanitized trip data:", JSON.stringify(cleanTrip, null, 2));

    if (generatePdfOnly) {
      console.log("Generating PDF only");
      try {
        const pdfBytes = await generatePDF(cleanTrip);
        const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
        
        return new Response(
          JSON.stringify({ pdf: pdfBase64 }), 
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        return createErrorResponse({
          message: "Failed to generate PDF",
          details: pdfError.message,
          statusCode: 500
        });
      }
    }

    if (!RESEND_API_KEY) {
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
        message: `You can only send testing emails to ${ALLOWED_TEST_EMAIL}`
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

    return await sendEmail(
      RESEND_API_KEY,
      to,
      `Trip Itinerary: ${cleanTrip.title}`,
      html
    );
  } catch (error: any) {
    return createErrorResponse(error);
  }
};

serve(handler);