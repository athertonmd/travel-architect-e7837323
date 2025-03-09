
import { supabase } from "@/integrations/supabase/client";
import { PdfSettings } from "@/types/pdf";
import { toast } from "sonner";

interface GeneratePdfResponse {
  pdfBase64: string;
}

interface PdfGenerationError {
  error: string;
  details?: string;
}

export async function generatePdfDocument(tripId: string, sessionToken: string): Promise<GeneratePdfResponse | PdfGenerationError> {
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

    try {
      // The key problem was here: we're missing proper body structure when calling the edge function
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: JSON.stringify({ 
          tripId, 
          pdfSettings 
        }),
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
        return { error: error.message || 'Failed to generate PDF' };
      }

      if (!data) {
        console.error('No data received from function');
        return { error: 'No response data from server' };
      }

      if (data.error) {
        console.error('Error returned in response data:', data.error);
        console.error('Error details:', data.details || 'No details available');
        
        // More user-friendly error messages
        let userMessage = 'Failed to generate PDF';
        
        if (data.error.includes('No segments')) {
          userMessage = 'Your trip needs at least one segment to generate a PDF. Please add some segments and try again.';
        } else if (data.error.includes('PDF creation error')) {
          userMessage = 'There was a problem creating your PDF. Please check your trip data and try again.';
        } else if (data.error.includes('Authentication error')) {
          userMessage = 'Authentication issues detected. Please log out and log back in, then try again.';
        }
        
        return { 
          error: userMessage,
          details: data.details
        };
      }

      if (!data.pdfBase64) {
        console.error('No PDF data in response:', data);
        return { error: "No PDF data received from the server" };
      }

      console.log("Successfully generated PDF with data length:", data.pdfBase64.length);
      return data as GeneratePdfResponse;
    } catch (invokeError) {
      console.error('Error invoking generate-pdf function:', invokeError);
      
      // Try to extract the detailed error message if available
      let errorMessage = 'Failed to generate PDF';
      let errorDetails = '';
      
      if (invokeError instanceof Error) {
        errorMessage = invokeError.message;
        errorDetails = invokeError.stack || '';
        
        // Check if it's an error response that contains JSON
        if (invokeError.message.includes('non-2xx status code')) {
          errorMessage = 'The PDF service encountered an error. Please check that your trip has data and try again.';
          
          // Additional context based on the Edge Function logs
          if (errorDetails.includes('Edge Function')) {
            errorDetails += '\nThis appears to be an issue with the PDF generation service. The development team has been notified.';
          }
        }
      }
      
      return { error: errorMessage, details: errorDetails };
    }
  } catch (error) {
    console.error('Error in generatePdfDocument:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage };
  }
}
