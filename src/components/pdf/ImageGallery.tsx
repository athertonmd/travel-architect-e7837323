
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "./ImageUploader";
import { GalleryContent } from "./gallery/GalleryContent";
import { useImageGallery } from "./gallery/useImageGallery";

interface ImageGalleryProps {
  onSelectImage: (url: string) => void;
  selectedUrl?: string;
  galleryType: "logo" | "banner";
}

export function ImageGallery({ onSelectImage, selectedUrl, galleryType }: ImageGalleryProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const { images, isLoading, loadImages, handleDelete } = useImageGallery();

  const handleUploadComplete = () => {
    // Reload the image gallery after upload
    loadImages();
    setActiveTab("gallery");
  };

  const handleImageDelete = (filename: string) => {
    handleDelete(filename);
    // If this was the selected image, clear the selection
    if (selectedUrl?.includes(filename)) {
      onSelectImage('');
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "gallery" | "upload")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="pt-4">
          <GalleryContent
            images={images}
            isLoading={isLoading}
            selectedUrl={selectedUrl}
            onSelectImage={onSelectImage}
            onDelete={handleImageDelete}
            onUploadClick={() => setActiveTab("upload")}
          />
        </TabsContent>

        <TabsContent value="upload" className="pt-4">
          <ImageUploader 
            galleryType={galleryType} 
            onUploadComplete={handleUploadComplete} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
