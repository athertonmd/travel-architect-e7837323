import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface PdfViewerProps {
  pdfData: string;
  title: string;
}

export function PdfViewer({ pdfData, title }: PdfViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (pdfData) {
      // Create a blob URL when the component mounts or pdfData changes
      const blob = new Blob([Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Cleanup the URL when the component unmounts or pdfData changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfData]);

  const handleDownload = () => {
    if (!pdfData) return;
    
    try {
      const blob = new Blob([Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))], { type: 'application/pdf' });
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

  if (!pdfUrl) {
    return <div>Loading PDF...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative min-h-[500px]">
        <iframe
          src={pdfUrl}
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