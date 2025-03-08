
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "./ImageUploader";

interface ImageGalleryProps {
  onSelectImage: (url: string) => void;
  selectedUrl?: string;
  galleryType: "logo" | "banner";
}

export function ImageGallery({ onSelectImage, selectedUrl, galleryType }: ImageGalleryProps) {
  const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({ 
          title: "Authentication required", 
          description: "Please sign in to access your images", 
          variant: "destructive" 
        });
        setIsLoading(false);
        return;
      }
      
      // List all files in the bucket for the current user
      const { data, error } = await supabase
        .storage
        .from('itinerary-images')
        .list(userData.user.id, {
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) {
        console.error('Error loading images:', error);
        toast({ 
          title: "Failed to load images", 
          description: error.message, 
          variant: "destructive" 
        });
      } else if (data) {
        // Generate URLs for the images
        const imageList = await Promise.all(
          data.map(async (file) => {
            const { data: urlData } = supabase
              .storage
              .from('itinerary-images')
              .getPublicUrl(`${userData.user?.id}/${file.name}`);
            
            return {
              name: file.name,
              url: urlData.publicUrl
            };
          })
        );
        
        setImages(imageList);
      }
    } catch (error) {
      console.error('Error in loadImages:', error);
      toast({ 
        title: "Error", 
        description: "Failed to load images", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      const { error } = await supabase
        .storage
        .from('itinerary-images')
        .remove([`${userData.user.id}/${filename}`]);
      
      if (error) {
        toast({ 
          title: "Delete failed", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        // Remove the image from the state
        setImages(images.filter(img => img.name !== filename));
        toast({ 
          title: "Image deleted", 
          description: "The image has been successfully deleted" 
        });
        
        // If this was the selected image, clear the selection
        if (selectedUrl?.includes(filename)) {
          onSelectImage('');
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({ 
        title: "Error", 
        description: "Failed to delete image", 
        variant: "destructive" 
      });
    }
  };

  const handleUploadComplete = () => {
    // Reload the image gallery after upload
    loadImages();
    setActiveTab("gallery");
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "gallery" | "upload")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p>Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
              <ImageIcon className="h-10 w-10 text-gray-400" />
              <p className="text-gray-500">No images found</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("upload")}
              >
                Upload your first image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {images.map((image) => (
                <Card 
                  key={image.name} 
                  className={`relative overflow-hidden group ${image.url === selectedUrl ? 'ring-2 ring-primary' : ''}`}
                >
                  <CardContent className="p-2">
                    <div className="relative aspect-square">
                      <img 
                        src={image.url} 
                        alt={image.name} 
                        className="w-full h-full object-cover rounded-sm"
                      />
                      
                      {image.url === selectedUrl && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => onSelectImage(image.url)}
                        >
                          {image.url === selectedUrl ? 'Selected' : 'Select'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(image.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs truncate mt-1">{image.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
