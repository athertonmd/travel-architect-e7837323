
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";

interface PdfViewerProps {
  pdfData: string;
  title: string;
}

export function PdfViewer({ pdfData, title }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (pdfData) {
      try {
        // Create a blob URL when the component mounts or pdfData changes
        console.log("Creating blob URL from PDF data");
        const byteCharacters = atob(pdfData);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        console.log("Blob URL created successfully");
        setPdfUrl(url);
        setIsLoading(false);

        // Cleanup the URL when the component unmounts or pdfData changes
        return () => {
          console.log("Revoking blob URL");
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error creating PDF blob:', error);
        setLoadError(`Failed to process PDF data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    }
  }, [pdfData]);

  const handleIframeLoad = () => {
    console.log("PDF iframe loaded");
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error("PDF iframe failed to load");
    setLoadError("Failed to display the PDF. Try downloading it instead.");
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!pdfData) {
      toast.error("No PDF data available for download");
      return;
    }
    
    try {
      console.log("Preparing PDF for download");
      const byteCharacters = atob(pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-itinerary.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error('Error in download handler:', error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-red-500 text-center mb-4">
          {loadError}
        </div>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF Instead
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative min-h-[500px]">
        {pdfUrl && (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="absolute inset-0 w-full h-full"
            title="PDF Preview"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
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
