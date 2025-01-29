import { supabase } from "@/integrations/supabase/client";

interface GeneratePdfResponse {
  pdfBase64: string;
}

export async function generatePdfDocument(tripId: string, sessionToken: string): Promise<GeneratePdfResponse> {
  console.log("Initiating PDF generation for trip:", tripId);
  
  const { data, error: functionError } = await supabase.functions.invoke(
    'generate-pdf',
    {
      body: { tripId },
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log("Response from generate-pdf function:", {
    hasData: !!data,
    hasError: !!functionError,
    errorMessage: functionError?.message
  });

  if (functionError) {
    console.error('Error from generate-pdf function:', functionError);
    throw new Error(functionError.message || 'Failed to generate PDF');
  }

  if (!data?.pdfBase64) {
    console.error('No PDF data in response:', data);
    throw new Error("No PDF data received from the server");
  }

  return data;
}