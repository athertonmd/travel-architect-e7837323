import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("PDF generation function loaded and ready");

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to generate-pdf function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tripId } = await req.json();
    console.log("Processing PDF request for trip:", tripId);
    
    if (!tripId) {
      console.error("No trip ID provided");
      throw new Error("Trip ID is required");
    }

    // Get Supabase client configuration
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("Fetching trip data from database...");
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
      console.error("No trip found with ID:", tripId);
      throw new Error("Trip not found");
    }

    console.log("Trip data fetched successfully");

    // For now, return a simple PDF (we can enhance this later)
    const pdfBase64 = btoa("Sample PDF Content");
    console.log("PDF generated successfully");

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

  } catch (error: any) {
    console.error("Error in generate-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
};

serve(handler);