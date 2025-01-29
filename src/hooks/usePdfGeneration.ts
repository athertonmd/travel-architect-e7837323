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
      // First generate the PDF
      console.log("Calling generate-pdf function...");
      const { data: pdfResult, error: pdfError } = await supabase.functions.invoke("generate-pdf", {
        body: { tripId }
      });

      if (pdfError) {
        console.error('Error generating PDF:', pdfError);
        throw new Error(pdfError.message || 'Failed to generate PDF');
      }

      if (!pdfResult?.pdfBase64) {
        console.error('No PDF data in response:', pdfResult);
        throw new Error("No PDF data received from the server");
      }

      console.log("PDF generated successfully");
      setPdfData(pdfResult.pdfBase64);

      // If email is provided, send the PDF
      if (userEmail) {
        console.log("Sending PDF via email to:", userEmail);
        const { error: emailError } = await supabase.functions.invoke("send-itinerary", {
          body: {
            tripId,
            to: [userEmail],
            pdfBase64: pdfResult.pdfBase64
          }
        });

        if (emailError) {
          console.error('Error sending email:', emailError);
          toast.error("PDF generated but failed to send email. Please try again later.");
        } else {
          console.log("Email sent successfully");
          toast.success("PDF generated and sent successfully!");
        }
      }

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