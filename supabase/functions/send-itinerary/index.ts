import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-itinerary function");
  
  // Handle CORS preflight requests
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

    const { tripId, to, generatePdfOnly = false }: EmailRequest = await req.json();
    
    if (!to || !Array.isArray(to) || to.length === 0) {
      throw new Error("No recipients specified");
    }

    // In development, only allow sending to athertonmd@gmail.com
    const ALLOWED_TEST_EMAIL = "athertonmd@gmail.com";
    if (to.some(email => email !== ALLOWED_TEST_EMAIL)) {
      throw {
        name: "validation_error",
        statusCode: 403,
        message: `You can only send testing emails to your own email address (${ALLOWED_TEST_EMAIL}). To send emails to other recipients, please verify a domain at resend.com/domains, and change the 'from' address to an email using this domain.`
      };
    }

    console.log("Processing email request for trip:", tripId, "to recipients:", to);

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

    // Create email HTML content
    const html = `
      <h1>Trip Itinerary: ${trip.title}</h1>
      <p>Destination: ${trip.destination || 'Not specified'}</p>
      <p>Start Date: ${trip.start_date || 'Not specified'}</p>
      <p>End Date: ${trip.end_date || 'Not specified'}</p>
      <p>Number of Travelers: ${trip.travelers}</p>
      
      <h2>Segments:</h2>
      ${trip.segments ? JSON.stringify(trip.segments, null, 2) : 'No segments added yet'}
    `;

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Trip Itinerary <onboarding@resend.dev>",
        to,
        subject: `Trip Itinerary: ${trip.title}`,
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