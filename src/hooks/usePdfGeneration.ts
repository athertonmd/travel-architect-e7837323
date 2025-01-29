import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePdfGenerationProps {
  tripId?: string;
  userEmail?: string;
}

export function usePdfGeneration({ tripId, userEmail }: UsePdfGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePdf = async () => {
    if (!tripId) {
      console.error("No trip ID provided");
      setError("Trip ID is required");
      return;
    }

    setIsGenerating(true);
    setError(null);
    console.log("Initiating PDF generation for trip:", tripId);

    try {
      const params = {
        tripId,
        generatePdfOnly: true,
        to: userEmail ? [userEmail] : []
      };
      
      console.log("Calling send-itinerary function with params:", params);

      const { data, error: functionError } = await supabase.functions.invoke("send-itinerary", {
        body: params,
      });

      console.log("Function response:", { data, error: functionError });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || 'Failed to generate PDF');
      }

      if (!data?.pdfBase64) {
        console.error('No PDF data in response:', data);
        throw new Error("No PDF data received from the server");
      }

      console.log("PDF data received, length:", data.pdfBase64.length);
      setPdfData(data.pdfBase64);
      console.log("PDF data set successfully");
    } catch (error) {
      console.error('Error in PDF generation:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF";
      setError(errorMessage);
      toast.error("Failed to generate PDF. Please try again later.");
    } finally {
      setIsGenerating(false);
      console.log("PDF generation process completed");
    }
  };

  const resetPdfState = () => {
    setPdfData(null);
    setError(null);
  };

  return {
    isGenerating,
    pdfData,
    error,
    generatePdf,
    resetPdfState
  };
}