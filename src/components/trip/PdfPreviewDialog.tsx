import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PdfViewer } from "./pdf/PdfViewer";
import { PdfLoadingState } from "./pdf/PdfLoadingState";
import { PdfErrorState } from "./pdf/PdfErrorState";
import { supabase } from "@/integrations/supabase/client";

interface PdfPreviewDialogProps {
  tripId?: string;
  title: string;
  userEmail?: string;
}

export function PdfPreviewDialog({ tripId, title, userEmail }: PdfPreviewDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const generatePdf = async () => {
    if (!tripId) {
      setError("Trip ID is required");
      return;
    }

    setIsGenerating(true);
    setError(null);
    console.log("Generating PDF for trip:", tripId);

    try {
      const { data, error } = await supabase.functions.invoke("send-itinerary", {
        body: {
          tripId,
          generatePdfOnly: true,
          to: [userEmail]
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log("Received response from PDF generation:", data);

      if (!data?.pdfBase64) {
        throw new Error("No PDF data received from the server");
      }

      setPdfData(data.pdfBase64);
      console.log("PDF data set successfully");
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(error instanceof Error ? error.message : "Failed to generate PDF. Please try again.");
      toast.error("Failed to generate PDF. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !pdfData && !isGenerating) {
      generatePdf();
    }
    if (!open) {
      setPdfData(null);
      setError(null);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <PdfErrorState 
          error={error}
          onRetry={generatePdf}
          isGenerating={isGenerating}
        />
      );
    }

    if (isGenerating) {
      return <PdfLoadingState message="Generating your PDF, please wait..." />;
    }

    if (pdfData) {
      return <PdfViewer pdfData={pdfData} title={title} />;
    }

    return <PdfLoadingState message="Opening preview..." />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-navy hover:bg-navy-light border border-white text-white"
      >
        <FileText className="mr-2 h-4 w-4" />
        PDF
      </Button>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Trip Itinerary</DialogTitle>
          <DialogDescription>
            Preview and download your trip itinerary in PDF format
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}