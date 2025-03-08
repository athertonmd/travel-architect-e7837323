
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface EmptyGalleryStateProps {
  onUploadClick: () => void;
}

export function EmptyGalleryState({ onUploadClick }: EmptyGalleryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
      <ImageIcon className="h-10 w-10 text-gray-400" />
      <p className="text-gray-500">No images found</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onUploadClick}
      >
        Upload your first image
      </Button>
    </div>
  );
}
