
import { QuickLink } from "../PdfPreview";
import { QuickLinksList } from "./QuickLinksList";
import { useState } from "react";
import { EditLinkDialog } from "./EditLinkDialog";
import { AddLinkDialog } from "./AddLinkDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuickLinksManagerProps {
  quickLinks: QuickLink[];
  onQuickLinksChange: (links: QuickLink[]) => void;
}

export function QuickLinksManager({ quickLinks, onQuickLinksChange }: QuickLinksManagerProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentEditingLink, setCurrentEditingLink] = useState<{index: number, link: QuickLink} | null>(null);

  const handleEditLink = (index: number) => {
    const link = quickLinks[index];
    setCurrentEditingLink({ index, link });
    setIsEditDialogOpen(true);
  };

  const handleSaveLink = (linkName: string, linkUrl: string) => {
    if (!currentEditingLink) return;
    
    const updatedLinks = [...quickLinks];
    updatedLinks[currentEditingLink.index] = {
      name: linkName,
      url: linkUrl
    };
    
    onQuickLinksChange(updatedLinks);
    setIsEditDialogOpen(false);
    
    toast.success("Quick link updated successfully");
  };

  const handleAddLink = (linkName: string, linkUrl: string) => {
    if (!linkName.trim()) {
      toast.error("Link title is required");
      return;
    }

    const validUrl = linkUrl.trim() ? linkUrl : "#";
    const newLinks = [...quickLinks, {
      name: linkName,
      url: validUrl
    }];
    
    onQuickLinksChange(newLinks);
    setIsAddDialogOpen(false);
    toast.success("New quick link added");
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...quickLinks];
    updatedLinks.splice(index, 1);
    
    onQuickLinksChange(updatedLinks);
    toast.success("Quick link removed");
  };

  return (
    <div className="p-4 border-t">
      <div className="flex justify-between items-center mb-4">
        <h5 className="font-medium text-gray-900">Quick Links</h5>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAddDialogOpen(true)} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </div>
      
      <QuickLinksList 
        quickLinks={quickLinks} 
        onEditLink={handleEditLink} 
        onRemoveLink={handleRemoveLink} 
      />
      
      <EditLinkDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentLink={currentEditingLink?.link || null}
        onSave={handleSaveLink}
      />
      
      <AddLinkDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddLink}
      />
    </div>
  );
}
