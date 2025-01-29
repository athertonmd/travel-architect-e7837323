import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

    try {
      const response = await fetch("/api/send-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          tripId, 
          generatePdfOnly: true,
          to: [userEmail]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to generate PDF: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.pdfBase64) {
        throw new Error("Invalid PDF data received");
      }
      setPdfData(data.pdfBase64);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError(error instanceof Error ? error.message : "Failed to generate PDF. Please try again.");
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfData) return;
    
    try {
      fetch(`data:application/pdf;base64,${pdfData}`)
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-itinerary.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("PDF downloaded successfully");
        });
    } catch (error) {
      console.error('Error in download handler:', error);
      toast.error("Failed to download PDF. Please try again.");
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
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
          <FileText className="h-12 w-12 text-red-400" />
          <p className="text-red-600 text-center">{error}</p>
          <Button onClick={generatePdf} disabled={isGenerating}>
            Try Again
          </Button>
        </div>
      );
    }

    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          <p className="text-gray-600">Generating PDF...</p>
        </div>
      );
    }

    if (pdfData) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 relative min-h-[500px]">
            <iframe
              src={`data:application/pdf;base64,${pdfData}`}
              className="absolute inset-0 w-full h-full"
              title="PDF Preview"
            />
          </div>
          <div className="flex justify-end p-4 border-t">
            <Button onClick={handleDownload}>
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <FileText className="h-12 w-12 text-gray-400" />
        <p className="text-gray-600">Opening preview...</p>
      </div>
    );
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
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}