
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PdfDesignFormValues } from "@/types/pdf";
import { toast } from "sonner";
import { generatePreviewHtml } from "./preview/generatePreviewHtml";

interface PdfPreviewProps {
  settings: PdfDesignFormValues;
}

export function PdfPreview({ settings }: PdfPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [travelerNames, setTravelerNames] = useState<string[]>(["John Smith"]); // Default value

  // Fetch traveler data if available - simulated for preview
  useEffect(() => {
    // In a real implementation, you would fetch this from your data source
    // This is just for demonstration in the preview
    const mockTravelerData = {
      traveller_names: ["Jane Doe", "Richard Roe"]
    };
    
    if (mockTravelerData.traveller_names && mockTravelerData.traveller_names.length > 0) {
      setTravelerNames(mockTravelerData.traveller_names);
    }
  }, []);

  // Generate the preview HTML
  useEffect(() => {
    const htmlContent = generatePreviewHtml(settings, travelerNames);
    setPreviewHtml(htmlContent);
  }, [settings, travelerNames]);

  const handleDownloadClick = async () => {
    try {
      console.log("Generating sample PDF...");
      
      // Create a simple PDF document using the browser's print functionality
      // Create a new window with the preview HTML
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Pop-up was blocked. Please allow pop-ups to download the sample PDF.");
        return;
      }
      
      // Write the preview HTML to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Trip Itinerary Sample</title>
            <style>
              body { font-family: ${settings.bodyFont || 'Arial'}, sans-serif; }
              h1, h2, h3 { font-family: ${settings.headerFont || 'Arial'}, sans-serif; }
              a { color: ${settings.primaryColor}; }
            </style>
          </head>
          <body>
            ${previewHtml}
            <script>
              // Auto print once loaded
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      
      toast.success("Sample PDF prepared for download");
    } catch (error) {
      console.error("Error generating sample PDF:", error);
      toast.error("Failed to generate sample PDF");
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h4 className="font-medium text-gray-900">PDF Preview</h4>
        <Button size="sm" variant="outline" className="gap-1" onClick={handleDownloadClick}>
          <Download className="h-4 w-4" />
          Download Sample
        </Button>
      </div>
      <div className="p-0 h-[600px] overflow-auto">
        <iframe
          srcDoc={previewHtml}
          title="PDF Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
