import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PdfViewer } from "./pdf/PdfViewer";
import { PdfLoadingState } from "./pdf/PdfLoadingState";
import { PdfErrorState } from "./pdf/PdfErrorState";
import { PdfDialogTrigger } from "./pdf/PdfDialogTrigger";
import { usePdfGeneration } from "@/hooks/usePdfGeneration";

interface PdfPreviewDialogProps {
  tripId?: string;
  title: string;
  userEmail?: string;
}

export function PdfPreviewDialog({ tripId, title, userEmail }: PdfPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isGenerating,
    pdfData,
    error,
    generatePdf,
    resetPdfState
  } = usePdfGeneration({ tripId, userEmail });

  const handleOpenChange = (open: boolean) => {
    console.log("PDF Dialog open state changing to:", open);
    console.log("Current state - pdfData:", !!pdfData, "isGenerating:", isGenerating);
    
    setIsOpen(open);
    if (open && !pdfData && !isGenerating) {
      console.log("Initiating PDF generation for trip:", tripId);
      generatePdf();
    }
    if (!open) {
      console.log("Closing dialog, resetting PDF state");
      resetPdfState();
    }
  };

  const renderContent = () => {
    if (error) {
      console.log("Rendering error state:", error);
      return (
        <PdfErrorState 
          error={error}
          onRetry={generatePdf}
          isGenerating={isGenerating}
        />
      );
    }

    if (isGenerating) {
      console.log("Rendering loading state - generating PDF");
      return <PdfLoadingState message="Generating your PDF, please wait..." />;
    }

    if (pdfData) {
      console.log("Rendering PDF viewer with data");
      return <PdfViewer pdfData={pdfData} title={title} />;
    }

    console.log("Rendering initial loading state");
    return <PdfLoadingState message="Opening preview..." />;
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