
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { QuickLink } from "../PdfPreview";

interface QuickLinksListProps {
  quickLinks: QuickLink[];
  onEditLink: (index: number) => void;
  onRemoveLink: (index: number) => void;
}

export function QuickLinksList({ quickLinks, onEditLink, onRemoveLink }: QuickLinksListProps) {
  return (
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
              onClick={() => onEditLink(index)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onRemoveLink(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
