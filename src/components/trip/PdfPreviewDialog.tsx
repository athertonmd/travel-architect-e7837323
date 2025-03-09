
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { PdfViewer } from "./pdf/PdfViewer";
import { PdfLoadingState } from "./pdf/PdfLoadingState";
import { PdfErrorState } from "./pdf/PdfErrorState";
import { PdfDialogTrigger } from "./pdf/PdfDialogTrigger";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";
import { toast } from "sonner";

interface PdfPreviewDialogProps {
  tripId?: string;
  title: string;
  userEmail?: string;
}

export function PdfPreviewDialog({ tripId, title, userEmail }: PdfPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generationAttempted, setGenerationAttempted] = useState(false);
  
  const {
    isGenerating,
    pdfData,
    error,
    generatePdf,
    resetPdfState
  } = usePdfGeneration({ tripId, userEmail });

  // Explicitly trigger PDF generation when dialog opens
  useEffect(() => {
    if (isOpen && !pdfData && !isGenerating && !generationAttempted && tripId) {
      console.log("Auto-initiating PDF generation with tripId:", tripId);
      setGenerationAttempted(true);
      generatePdf().catch(err => {
        console.error("Error initiating PDF generation:", err);
        toast.error("Could not generate PDF");
      });
    }
  }, [isOpen, pdfData, isGenerating, generationAttempted, tripId, generatePdf]);

  const handleOpenChange = (open: boolean) => {
    console.log("PDF Dialog open state changing to:", open);
    console.log("Current state - tripId:", tripId, "userEmail:", userEmail);
    console.log("PDF generation state:", { isGenerating, hasPdfData: !!pdfData, error });
    
    setIsOpen(open);
    
    // We won't trigger PDF generation here anymore, it's handled by the useEffect
    
    if (!open) {
      console.log("Closing dialog, resetting PDF state");
      resetPdfState();
      setGenerationAttempted(false);
    }
  };

  const handleRetryGeneration = () => {
    console.log("Retrying PDF generation with tripId:", tripId);
    setGenerationAttempted(true);
    generatePdf().catch(err => {
      console.error("Error retrying PDF generation:", err);
      toast.error("Could not generate PDF on retry");
    });
  };

  useEffect(() => {
    // Log state changes for debugging
    console.log("PdfPreviewDialog state changed:", {
      isOpen,
      isGenerating,
      hasPdfData: !!pdfData,
      error,
      generationAttempted,
      tripId
    });
  }, [isOpen, isGenerating, pdfData, error, generationAttempted, tripId]);

  const renderContent = () => {
    if (error) {
      console.log("Rendering error state:", error);
      return (
        <PdfErrorState 
          error={error}
          onRetry={handleRetryGeneration}
          isGenerating={isGenerating}
        />
      );
    }

    if (isGenerating || !pdfData) {
      const message = isGenerating ? "Generating your PDF, please wait..." : "Opening preview...";
      console.log("Rendering loading state:", message);
      return <PdfLoadingState message={message} />;
    }

    console.log("Rendering PDF viewer with data length:", pdfData.length);
    return <PdfViewer pdfData={pdfData} title={title} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <PdfDialogTrigger onClick={() => setIsOpen(true)} />
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
