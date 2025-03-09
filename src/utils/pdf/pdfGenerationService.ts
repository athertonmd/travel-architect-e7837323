
import { supabase } from "@/integrations/supabase/client";
import { PdfSettings } from "@/types/pdf";
import { toast } from "sonner";

interface GeneratePdfResponse {
  pdfBase64: string;
}

export async function generatePdfDocument(tripId: string, sessionToken: string): Promise<GeneratePdfResponse> {
  console.log("Initiating PDF generation for trip:", tripId);
  
  if (!tripId) {
    throw new Error("Trip ID is required for PDF generation");
  }
  
  if (!sessionToken) {
    throw new Error("Authentication token is required for PDF generation");
  }
  
  try {
    // First, try to get the user's PDF design settings
    console.log("Fetching user information using session token");
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(sessionToken);
    
    if (userError) {
      console.error("Authentication error:", userError);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    if (!user) {
      console.error("No authenticated user found");
      throw new Error("User authentication failed");
    }
    
    console.log("User authenticated successfully:", user.id);
    
    let pdfSettings = null;
    
    console.log("Getting PDF settings for user:", user.id);
    const { data: settingsData, error: settingsError } = await supabase
      .rpc('get_pdf_settings_for_user', { user_id_param: user.id });
    
    if (settingsError) {
      console.error("Error fetching PDF settings:", settingsError);
      toast.error("Could not fetch your PDF design settings");
    }
    
    if (settingsData) {
      console.log("Found custom PDF settings:", Object.keys(settingsData));
      pdfSettings = settingsData;
    } else {
      console.log("No custom PDF settings found, using defaults");
    }
    
    console.log("Making request to generate-pdf function");
    console.log("Request details:", {
      tripId,
      hasSessionToken: !!sessionToken,
      tokenLength: sessionToken?.length,
      hasPdfSettings: !!pdfSettings,
      settingsKeys: pdfSettings ? Object.keys(pdfSettings) : []
    });

    const { data, error } = await supabase.functions.invoke('generate-pdf', {
      body: { 
        tripId,
        pdfSettings 
      },
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Response received from generate-pdf function:", {
      hasData: !!data,
      hasError: !!error,
      errorDetails: error,
      dataKeys: data ? Object.keys(data) : []
    });

    if (error) {
      console.error('Error from generate-pdf function:', error);
      throw new Error(error.message || 'Failed to generate PDF');
    }

    if (!data?.pdfBase64) {
      console.error('No PDF data in response:', data);
      throw new Error("No PDF data received from the server");
    }

    console.log("Successfully generated PDF with data length:", data.pdfBase64.length);
    return data as GeneratePdfResponse;
  } catch (error) {
    console.error('Error in generatePdfDocument:', error);
    throw error;
  }
}
