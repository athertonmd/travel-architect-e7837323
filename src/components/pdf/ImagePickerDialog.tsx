
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ImageGallery } from "./ImageGallery";

interface ImagePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentImageUrl?: string;
  title: string;
  description: string;
  galleryType: "logo" | "banner";
}

export function ImagePickerDialog({
  isOpen,
  onClose,
  onSelect,
  currentImageUrl,
  title,
  description,
  galleryType,
}: ImagePickerDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string>(currentImageUrl || '');

  // Update selectedImage when currentImageUrl changes (when dialog reopens)
  useEffect(() => {
    setSelectedImage(currentImageUrl || '');
  }, [currentImageUrl, isOpen]);

  const handleApply = () => {
    if (selectedImage) {
      onSelect(selectedImage);
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedImage('');
    onSelect('');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ImageGallery
            onSelectImage={setSelectedImage}
            selectedUrl={selectedImage}
            galleryType={galleryType}
          />
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClear}
          >
            Clear Selection
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!selectedImage}
            >
              Apply Image
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
