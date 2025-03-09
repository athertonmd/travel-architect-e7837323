
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
  bannerImageUrl?: string;
  showPageNumbers: boolean;
  includeNotes: boolean;
  includeContactInfo: boolean;
  includeQuickLinks: boolean;
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
      console.error("Missing Authorization header");
      throw new Error("Missing Authorization header");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing Supabase configuration env variables");
      throw new Error("Server configuration error: Missing Supabase configuration");
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log("Request body parsed successfully");
    } catch (e) {
      console.error("Error parsing request body:", e);
      throw new Error("Invalid request body format");
    }
    
    const { tripId, pdfSettings } = requestBody;
    
    console.log("Processing PDF generation for trip:", tripId);
    console.log("Custom PDF settings provided:", pdfSettings ? "Yes" : "No");

    if (!tripId) {
      console.error("No trip ID provided");
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
    console.log("Getting user from auth token");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      throw new Error(`Authentication error: ${userError.message}`);
    }

    if (!user) {
      console.error("No user found from token");
      throw new Error("Unauthorized: User not found");
    }

    console.log("User authenticated successfully:", user.id);

    // Retrieve trip data
    console.log("Fetching trip data from database");
    const { data: trip, error: tripError } = await supabaseClient
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (tripError) {
      console.error("Error fetching trip:", tripError);
      throw new Error(`Database error: ${tripError.message}`);
    }

    if (!trip) {
      console.error("Trip not found with ID:", tripId);
      throw new Error("Trip not found");
    }

    console.log("Trip data fetched successfully. Generating PDF...");
    
    try {
      // Generate PDF with optional custom settings
      const pdfBytes = await generatePDF(trip, pdfSettings as PdfSettings | undefined);
      
      if (!pdfBytes || pdfBytes.length === 0) {
        console.error("PDF generation returned empty data");
        throw new Error("PDF generation failed: Empty data returned");
      }
      
      // Convert PDF bytes to base64
      const pdfBase64 = btoa(
        String.fromCharCode(...new Uint8Array(pdfBytes))
      );

      console.log("PDF generated successfully, returning base64 data of length:", pdfBase64.length);
      
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
    } catch (pdfError) {
      console.error("Error in PDF generation:", pdfError);
      throw new Error(`PDF creation error: ${pdfError.message || "Unknown error in PDF generation"}`);
    }
  } catch (error) {
    console.error("Error in generate-pdf function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : null
      }),
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
