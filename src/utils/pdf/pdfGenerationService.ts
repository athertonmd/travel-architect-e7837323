
import { supabase } from "@/integrations/supabase/client";

interface GeneratePdfResponse {
  pdfBase64: string;
}

export async function generatePdfDocument(tripId: string, sessionToken: string): Promise<GeneratePdfResponse> {
  console.log("Initiating PDF generation for trip:", tripId);
  
  try {
    // First, try to get the user's PDF design settings
    const {
      data: { user },
    } = await supabase.auth.getUser(sessionToken);
    
    let pdfSettings = null;
    if (user) {
      const { data: settingsData } = await supabase
        .from('pdf_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      pdfSettings = settingsData;
      console.log("Using custom PDF settings:", pdfSettings ? "Yes" : "No");
    }
    
    console.log("Making request to generate-pdf function");
    console.log("Request details:", {
      tripId,
      hasSessionToken: !!sessionToken,
      tokenLength: sessionToken?.length,
      hasPdfSettings: !!pdfSettings
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
