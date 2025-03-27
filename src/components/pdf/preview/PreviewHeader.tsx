
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

interface PreviewHeaderProps {
  onAddLinkClick: () => void;
  onDownloadClick: () => void;
}

export function PreviewHeader({ onAddLinkClick, onDownloadClick }: PreviewHeaderProps) {
  return (
    <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
      <h4 className="font-medium text-gray-900">PDF Preview</h4>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1" 
          onClick={onAddLinkClick}
        >
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
        <Button size="sm" variant="outline" className="gap-1" onClick={onDownloadClick}>
          <Download className="h-4 w-4" />
          Download Sample
        </Button>
      </div>
    </div>
  );
}
