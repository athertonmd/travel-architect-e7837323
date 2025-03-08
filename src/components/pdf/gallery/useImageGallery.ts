
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useImageGallery() {
  const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    loadImages();
  }, []);

  return {
    images,
    isLoading,
    loadImages,
    handleDelete
  };
}
