
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Plus } from "lucide-react";
import { PdfDesignFormValues } from "@/types/pdf";
import { toast } from "sonner";
import { generatePreviewHtml } from "./preview/generatePreviewHtml";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditingLink, setCurrentEditingLink] = useState<{index: number, link: QuickLink} | null>(null);
  const [editLinkName, setEditLinkName] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

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
    
    // Update the parent form with the updated quickLinks
    if (settings.quickLinks !== quickLinks) {
      // This is using the undocumented __INTERNAL_formValueChange event
      // Ideally you should use the form's setValue method, but since we don't have direct access to it here
      const event = new CustomEvent('__INTERNAL_QUICK_LINKS_CHANGE', { 
        detail: { quickLinks } 
      });
      document.dispatchEvent(event);
    }
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

  const handleEditLink = (index: number) => {
    const link = quickLinks[index];
    setCurrentEditingLink({ index, link });
    setEditLinkName(link.name);
    setEditLinkUrl(link.url);
    setIsEditDialogOpen(true);
  };

  const handleSaveLink = () => {
    if (!currentEditingLink) return;
    
    const updatedLinks = [...quickLinks];
    updatedLinks[currentEditingLink.index] = {
      name: editLinkName,
      url: editLinkUrl
    };
    
    setQuickLinks(updatedLinks);
    setIsEditDialogOpen(false);
    toast.success("Quick link updated successfully");
  };

  const handleAddLink = () => {
    if (!newLinkName.trim()) {
      toast.error("Link title is required");
      return;
    }

    const validUrl = newLinkUrl.trim() ? newLinkUrl : "#";
    
    setQuickLinks([...quickLinks, {
      name: newLinkName,
      url: validUrl
    }]);
    
    setIsAddDialogOpen(false);
    setNewLinkName("");
    setNewLinkUrl("");
    toast.success("New quick link added");
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...quickLinks];
    updatedLinks.splice(index, 1);
    setQuickLinks(updatedLinks);
    toast.success("Quick link removed");
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h4 className="font-medium text-gray-900">PDF Preview</h4>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={handleDownloadClick}>
            <Download className="h-4 w-4" />
            Download Sample
          </Button>
        </div>
      </div>
      <div className="p-0 h-[600px] overflow-auto">
        <iframe
          srcDoc={previewHtml}
          title="PDF Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>

      {/* Quick Links Management Section */}
      <div className="p-4 border-t">
        <h5 className="font-medium text-gray-900 mb-2">Quick Links</h5>
        <div className="space-y-2">
          {quickLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1">
                <p className="font-medium">{link.name}</p>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditLink(index)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveLink(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Link Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Quick Link</DialogTitle>
            <DialogDescription>
              Customize the link title and URL. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-name" className="text-right">
                Link Title
              </Label>
              <Input
                id="link-name"
                value={editLinkName}
                onChange={(e) => setEditLinkName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link-url" className="text-right">
                URL
              </Label>
              <Input
                id="link-url"
                value={editLinkUrl}
                onChange={(e) => setEditLinkUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLink}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Link Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Quick Link</DialogTitle>
            <DialogDescription>
              Add a new link to the quick links section of your PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-link-name" className="text-right">
                Link Title
              </Label>
              <Input
                id="new-link-name"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-link-url" className="text-right">
                URL
              </Label>
              <Input
                id="new-link-url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLink}>Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
