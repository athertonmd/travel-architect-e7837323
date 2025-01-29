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
    console.log("Dialog open state changing to:", open);
    setIsOpen(open);
    if (open && !pdfData && !isGenerating) {
      generatePdf();
    }
    if (!open) {
      resetPdfState();
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