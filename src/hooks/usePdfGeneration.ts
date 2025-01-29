import { useState } from "react";
import { generatePdfDocument } from "@/utils/pdf/pdfGenerationService";
import { sendPdfViaEmail } from "@/utils/pdf/pdfEmailService";
import { getAuthenticatedSession } from "@/utils/pdf/sessionUtils";

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
    
    try {
      const session = await getAuthenticatedSession();
      const { pdfBase64 } = await generatePdfDocument(tripId, session.access_token);
      setPdfData(pdfBase64);

      if (userEmail) {
        await sendPdfViaEmail(tripId, userEmail, pdfBase64);
      }
    } catch (error) {
      console.error('Error in PDF generation:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPdfState = () => {
    console.log("Resetting PDF state");
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