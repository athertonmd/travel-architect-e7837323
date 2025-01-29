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
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication error");
      }

      if (!session) {
        console.error("No active session found");
        throw new Error("No active session");
      }

      console.log("Calling generate-pdf function with session token...");
      const { data, error: functionError } = await supabase.functions.invoke(
        'generate-pdf',
        {
          body: { tripId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
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

      console.log("PDF generated successfully");
      setPdfData(data.pdfBase64);

      // If email is provided, send the PDF
      if (userEmail) {
        console.log("Sending PDF via email to:", userEmail);
        const { error: emailError } = await supabase.functions.invoke("send-itinerary", {
          body: {
            tripId,
            to: [userEmail],
            pdfBase64: data.pdfBase64
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