import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generatePDF } from "./pdfGenerator.ts";
import { formatItinerary } from "./emailFormatter.ts";

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
      throw new Error("In development mode, you can only send emails to your own email address.");
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

    if (!res.ok) {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), {
        status: 400,
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
      error: error.message,
      details: error.response?.data || error.response || error
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);