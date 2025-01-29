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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { tripId, to, generatePdfOnly = false }: EmailRequest = await req.json();
    console.log("Processing request for trip:", tripId, "generatePdfOnly:", generatePdfOnly);
    
    if (!tripId) {
      throw new Error("Trip ID is required");
    }

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError) {
      console.error("Error fetching trip:", tripError);
      throw tripError;
    }

    if (!trip) {
      throw new Error("Trip not found");
    }

    console.log("Trip data fetched successfully");
    const cleanTrip = sanitizeTripData(trip);
    console.log("Trip data sanitized");

    try {
      const pdfBytes = await generatePDF(cleanTrip);
      console.log("PDF generated successfully");

      if (generatePdfOnly) {
        const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
        return new Response(
          JSON.stringify({ pdfBase64 }), 
          { 
            status: 200,
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        );
      }

      if (!to || !Array.isArray(to) || to.length === 0) {
        throw new Error("No recipients specified for email");
      }

      const emailResponse = await sendEmail(to, cleanTrip.title, pdfBytes);
      console.log("Email sent successfully");

      return new Response(
        JSON.stringify(emailResponse),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );

    } catch (pdfError) {
      console.error("Error in PDF generation or email sending:", pdfError);
      return createErrorResponse(pdfError);
    }

  } catch (error: any) {
    console.error("Error in send-itinerary function:", error);
    return createErrorResponse(error);
  }
};

serve(handler);