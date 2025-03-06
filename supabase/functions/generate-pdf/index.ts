
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generatePDF } from "../send-itinerary/pdfGenerator.ts";

console.log("Edge function loaded: generate-pdf");

interface PdfSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerFont: string;
  bodyFont: string;
  logoUrl?: string;
  showPageNumbers: boolean;
  includeNotes: boolean;
  includeContactInfo: boolean;
  dateFormat: string;
  timeFormat: string;
  companyName?: string;
  headerText?: string;
  footerText?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to generate-pdf function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    // Parse request body
    const requestBody = await req.json();
    const { tripId, pdfSettings } = requestBody;
    
    console.log("Processing PDF generation for trip:", tripId);
    console.log("Custom PDF settings provided:", pdfSettings ? "Yes" : "No");

    if (!tripId) {
      throw new Error("Trip ID is required");
    }

    // Create authenticated Supabase client
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Get user session
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Retrieve trip data
    const { data: trip, error: tripError } = await supabaseClient
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (tripError) {
      console.error("Error fetching trip:", tripError);
      throw tripError;
    }

    if (!trip) {
      throw new Error("Trip not found");
    }

    // Generate PDF with optional custom settings
    const pdfBytes = await generatePDF(trip, pdfSettings as PdfSettings | undefined);
    
    // Convert PDF bytes to base64
    const pdfBase64 = btoa(
      String.fromCharCode(...new Uint8Array(pdfBytes))
    );

    console.log("PDF generated successfully, returning base64 data");
    return new Response(
      JSON.stringify({ pdfBase64 }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in generate-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
};

serve(handler);
