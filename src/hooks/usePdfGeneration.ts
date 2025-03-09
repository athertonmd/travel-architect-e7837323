
import { useState } from "react";
import { generatePdfDocument } from "@/utils/pdf/pdfGenerationService";
import { sendPdfViaEmail } from "@/utils/pdf/pdfEmailService";
import { getAuthenticatedSession } from "@/utils/pdf/sessionUtils";
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
      console.error("No trip ID provided for PDF generation");
      setError("Trip ID is required");
      return;
    }

    console.log("Starting PDF generation for trip:", tripId);
    setIsGenerating(true);
    setError(null);
    setPdfData(null);
    
    try {
      console.log("Getting authenticated session");
      const session = await getAuthenticatedSession();
      console.log("Session obtained, generating PDF document");
      
      // Set a timeout to prevent hanging indefinitely
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("PDF generation timed out")), 30000); // 30 seconds timeout
      });
      
      // Race the PDF generation against the timeout
      const { pdfBase64 } = await Promise.race([
        generatePdfDocument(tripId, session.access_token),
        timeoutPromise
      ]) as { pdfBase64: string };
      
      console.log("PDF document generated successfully, data length:", pdfBase64.length);
      
      if (!pdfBase64 || pdfBase64.length === 0) {
        throw new Error("Received empty PDF data from the server");
      }
      
      setPdfData(pdfBase64);

      if (userEmail) {
        console.log("Sending PDF via email to:", userEmail);
        await sendPdfViaEmail(tripId, userEmail, pdfBase64);
        console.log("PDF email sent successfully");
      }
    } catch (error) {
      console.error('Error in PDF generation:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate PDF";
      setError(errorMessage);
      setPdfData(null);
      toast.error(`PDF generation failed: ${errorMessage}`);
    } finally {
      console.log("PDF generation process completed");
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
