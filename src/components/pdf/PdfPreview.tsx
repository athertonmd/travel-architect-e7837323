import { useEffect, useState } from "react";
import { PdfDesignFormValues } from "@/types/pdf";
import { toast } from "sonner";
import { generatePreviewHtml } from "./preview/generatePreviewHtml";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewIframe } from "./preview/PreviewIframe";
import { QuickLinksManager } from "./preview/QuickLinksManager";
import { supabase } from "@/integrations/supabase/client";

interface PdfPreviewProps {
  settings: PdfDesignFormValues;
}

export type QuickLink = {
  name: string;
  url: string;
}

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  { name: "Company Portal", url: "#" },
  { name: "Weather", url: "https://weather.com" },
  { name: "Visa & Passport", url: "https://travel.state.gov" },
  { name: "Currency Converter", url: "https://xe.com" },
  { name: "World Clock", url: "https://worldtimebuddy.com" },
];

export function PdfPreview({ settings }: PdfPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [travelerNames, setTravelerNames] = useState<string[]>(["John Smith"]); // Default value
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(settings.quickLinks || DEFAULT_QUICK_LINKS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Sync quickLinks with settings when settings change
  useEffect(() => {
    if (settings.quickLinks && settings.quickLinks.length > 0) {
      setQuickLinks(settings.quickLinks);
    }
  }, [settings.quickLinks]);

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
    // Create a copy of settings with the current quickLinks
    const settingsWithQuickLinks = {
      ...settings,
      quickLinks: quickLinks
    };
    
    const htmlContent = generatePreviewHtml(settingsWithQuickLinks, travelerNames, quickLinks);
    setPreviewHtml(htmlContent);
  }, [settings, travelerNames, quickLinks]);

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

  const saveQuickLinksToDatabase = async (links: QuickLink[]) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user?.id) {
        console.error("No authenticated user found");
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Use explicit typing for the update operation
      const updateData = { quick_links: links };
      
      const { error } = await supabase
        .from('pdf_settings')
        .update(updateData as any)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error saving quick links:', error);
        throw error;
      }
      
      console.log("Quick links saved successfully to database");
    } catch (error) {
      console.error('Error in saveQuickLinksToDatabase:', error);
      throw error;
    }
  };

  const handleQuickLinksChange = async (newLinks: QuickLink[]) => {
    setQuickLinks(newLinks);
    
    // This event will be caught by the PdfDesignForm component
    const event = new CustomEvent('__INTERNAL_QUICK_LINKS_CHANGE', { 
      detail: { quickLinks: newLinks } 
    });
    document.dispatchEvent(event);
    
    // Save the changes to the database directly
    try {
      await saveQuickLinksToDatabase(newLinks);
    } catch (error) {
      console.error("Error saving quick links:", error);
      toast.error("Failed to save quick links");
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <PreviewHeader 
        onAddLinkClick={() => setIsAddDialogOpen(true)} 
        onDownloadClick={handleDownloadClick} 
      />
      
      <PreviewIframe previewHtml={previewHtml} />

      {/* Quick Links Management Section */}
      <QuickLinksManager 
        quickLinks={quickLinks} 
        onQuickLinksChange={handleQuickLinksChange} 
      />
    </div>
  );
}
