import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

interface PdfViewerProps {
  pdfData: string;
  title: string;
}

export function PdfViewer({ pdfData, title }: PdfViewerProps) {
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