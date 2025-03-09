
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generatePDF } from "../send-itinerary/pdfGenerator.ts";

console.log("Edge function loaded: generate-pdf");

interface PdfSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headerFont?: string;
  bodyFont?: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  showPageNumbers?: boolean;
  includeNotes?: boolean;
  includeContactInfo?: boolean;
  includeQuickLinks?: boolean;
  dateFormat?: string;
  timeFormat?: string;
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
      // Fix: The request body is already parsed by the functions.invoke call when using JSON.stringify in the client
      requestBody = await req.json();
      console.log("Request body parsed successfully:", requestBody);
    } catch (e) {
      console.error("Error parsing request body:", e);
      throw new Error("Invalid request body format");
    }
    
    const { tripId, pdfSettings } = requestBody;
    
    console.log("Processing PDF generation for trip:", tripId);
    console.log("Custom PDF settings provided:", pdfSettings ? "Yes" : "No");

    // Debug: Log the actual fields in the pdfSettings to check for mismatches
    if (pdfSettings) {
      console.log("PDF Settings keys:", Object.keys(pdfSettings));
      // Convert database field names to expected PdfSettings interface format
      const mappedSettings: PdfSettings = {};
      
      // Map snake_case database fields to camelCase as used in the interface
      if (pdfSettings.primary_color) mappedSettings.primaryColor = pdfSettings.primary_color;
      if (pdfSettings.secondary_color) mappedSettings.secondaryColor = pdfSettings.secondary_color;
      if (pdfSettings.accent_color) mappedSettings.accentColor = pdfSettings.accent_color;
      if (pdfSettings.header_font) mappedSettings.headerFont = pdfSettings.header_font;
      if (pdfSettings.body_font) mappedSettings.bodyFont = pdfSettings.body_font;
      if (pdfSettings.logo_url) mappedSettings.logoUrl = pdfSettings.logo_url;
      if (pdfSettings.banner_image_url) mappedSettings.bannerImageUrl = pdfSettings.banner_image_url;
      if (pdfSettings.show_page_numbers !== undefined) mappedSettings.showPageNumbers = pdfSettings.show_page_numbers;
      if (pdfSettings.include_notes !== undefined) mappedSettings.includeNotes = pdfSettings.include_notes;
      if (pdfSettings.include_contact_info !== undefined) mappedSettings.includeContactInfo = pdfSettings.include_contact_info;
      if (pdfSettings.include_quick_links !== undefined) mappedSettings.includeQuickLinks = pdfSettings.include_quick_links;
      if (pdfSettings.date_format) mappedSettings.dateFormat = pdfSettings.date_format;
      if (pdfSettings.time_format) mappedSettings.timeFormat = pdfSettings.time_format;
      if (pdfSettings.company_name) mappedSettings.companyName = pdfSettings.company_name;
      if (pdfSettings.header_text) mappedSettings.headerText = pdfSettings.header_text;
      if (pdfSettings.footer_text) mappedSettings.footerText = pdfSettings.footer_text;
      
      console.log("Mapped PDF settings:", mappedSettings);
      
      // Replace the original snake_case settings with the mapped camelCase settings
      pdfSettings = mappedSettings;
    }

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
    
    // More detailed debugging for trip data
    console.log("Trip data retrieved:", {
      id: trip.id,
      title: trip.title,
      hasSegments: !!trip.segments,
      segmentsType: trip.segments ? typeof trip.segments : 'undefined',
      segmentsIsArray: trip.segments ? Array.isArray(trip.segments) : false,
      segmentsCount: trip.segments && Array.isArray(trip.segments) ? trip.segments.length : 0
    });
    
    // Check if trip data is complete enough to generate a PDF
    if (!trip.segments || !Array.isArray(trip.segments) || trip.segments.length === 0) {
      console.error("Trip has no segments:", tripId);
      throw new Error("Trip has no segments to include in the PDF");
    }

    // Sample the first segment to see its structure
    if (trip.segments.length > 0) {
      console.log("First segment example:", JSON.stringify(trip.segments[0]).substring(0, 500));
    }

    console.log("Trip data fetched successfully, segments count:", trip.segments.length);
    console.log("Trip details:", {
      title: trip.title,
      destination: trip.destination,
      startDate: trip.start_date,
      endDate: trip.end_date
    });
    console.log("Generating PDF...");
    
    try {
      // Generate PDF with optional custom settings
      const pdfBytes = await generatePDF(trip, pdfSettings);
      
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
      console.error("Error stack:", pdfError instanceof Error ? pdfError.stack : "No stack available");
      
      // Try to get more details about the error
      let errorDetails = "Unknown error in PDF generation";
      if (pdfError instanceof Error) {
        errorDetails = pdfError.message;
        // Check if it contains nested errors
        if (pdfError.message.includes("Error in")) {
          errorDetails += " - This may indicate a problem with the PDF content or settings.";
        }
      }
      
      throw new Error(`PDF creation error: ${errorDetails}`);
    }
  } catch (error) {
    console.error("Error in generate-pdf function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : null;
    
    console.error("Returning error response:", errorMessage);
    if (errorStack) {
      console.error("Error stack:", errorStack);
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorStack,
        timestamp: new Date().toISOString()
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
