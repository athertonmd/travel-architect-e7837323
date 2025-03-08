
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Trash2 } from "lucide-react";

interface ImageGalleryItemProps {
  image: { name: string; url: string };
  isSelected: boolean;
  onSelect: (url: string) => void;
  onDelete: (filename: string) => void;
}

export function ImageGalleryItem({ 
  image, 
  isSelected, 
  onSelect, 
  onDelete 
}: ImageGalleryItemProps) {
  return (
    <Card 
      key={image.name} 
      className={`relative overflow-hidden group ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      <CardContent className="p-2">
        <div className="relative aspect-square">
          <img 
            src={image.url} 
            alt={image.name} 
            className="w-full h-full object-cover rounded-sm"
          />
          
          {isSelected && (
            <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onSelect(image.url)}
            >
              {isSelected ? 'Selected' : 'Select'}
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(image.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs truncate mt-1">{image.name}</p>
      </CardContent>
    </Card>
  );
}
