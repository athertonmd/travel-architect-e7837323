import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PdfPreviewDialogProps {
  tripId: string;
  title: string;
  userEmail: string | undefined;
}

export function PdfPreviewDialog({ tripId, title, userEmail }: PdfPreviewDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePdf = async () => {
    if (!tripId) {
      toast.error("Trip ID is required to generate PDF");
      return;
    }

    if (!userEmail) {
      toast.error("You must be logged in to download the PDF");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating PDF for trip:', tripId);
      const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: { 
          tripId, 
          generatePdfOnly: true,
          to: [userEmail] // Required by the function but not used for PDF generation
        }
      });

      if (error) throw error;
      
      if (!data?.pdf) {
        throw new Error('No PDF data received from the server');
      }
      
      console.log('PDF generated successfully');
      setPdfData(data.pdf);
      
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      setError(error.message || "Failed to generate PDF");
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfData) return;
    
    try {
      // Convert base64 to Blob
      fetch(`data:application/pdf;base64,${pdfData}`)
        .then(res => res.blob())
        .then(blob => {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-itinerary.pdf`);
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("PDF downloaded successfully");
        })
        .catch(error => {
          console.error('Error downloading PDF:', error);
          toast.error("Failed to download PDF. Please try again.");
        });
    } catch (error) {
      console.error('Error in download handler:', error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-navy" />
          <p className="text-gray-600">Generating preview...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              generatePdf();
            }}
            className="bg-navy hover:bg-navy-light text-white"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (pdfData) {
      return (
        <iframe 
          src={`data:application/pdf;base64,${pdfData}`}
          className="w-full h-full"
          title="PDF Preview"
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <FileText className="h-12 w-12 text-gray-400" />
        <p className="text-gray-600">Click generate to preview the PDF</p>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-navy hover:bg-navy-light border border-white text-white"
          onClick={() => !pdfData && generatePdf()}
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Trip Itinerary Preview</DialogTitle>
          <DialogDescription>
            Review your itinerary before downloading
          </DialogDescription>
        </DialogHeader>
        <div className="h-[60vh] overflow-auto border rounded-md p-4 bg-gray-50">
          {renderContent()}
        </div>
        <DialogFooter>
          <Button
            onClick={handleDownload}
            disabled={!pdfData || isGenerating}
            className="bg-navy hover:bg-navy-light text-white"
          >
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}