
import { ImageGalleryItem } from "./ImageGalleryItem";
import { EmptyGalleryState } from "./EmptyGalleryState";

interface GalleryContentProps {
  images: Array<{ name: string; url: string }>;
  isLoading: boolean;
  selectedUrl?: string;
  onSelectImage: (url: string) => void;
  onDelete: (filename: string) => void;
  onUploadClick: () => void;
}

export function GalleryContent({ 
  images, 
  isLoading, 
  selectedUrl, 
  onSelectImage, 
  onDelete,
  onUploadClick
}: GalleryContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p>Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return <EmptyGalleryState onUploadClick={onUploadClick} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {images.map((image) => (
        <ImageGalleryItem
          key={image.name}
          image={image}
          isSelected={image.url === selectedUrl}
          onSelect={onSelectImage}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
