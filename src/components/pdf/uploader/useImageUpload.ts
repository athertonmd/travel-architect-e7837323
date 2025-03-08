
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadProps {
  galleryType: "logo" | "banner";
  onUploadComplete: () => void;
}

export function useImageUpload({ galleryType, onUploadComplete }: UseImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }
    
    // Validate file size (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    try {
      setUploading(true);
      setProgress(0);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({ 
          title: "Authentication required", 
          description: "Please sign in to upload images", 
          variant: "destructive" 
        });
        return;
      }
      
      // Generate a unique filename with timestamp prefix
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const typePrefix = galleryType === 'logo' ? 'logo' : 'banner';
      const fileName = `${typePrefix}-${timestamp}.${fileExt}`;
      const filePath = `${userData.user.id}/${fileName}`;
      
      // Create a simulated progress update
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 95);
        });
      }, 200);
      
      // Upload to supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('itinerary-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      clearInterval(progressInterval);
      
      if (uploadError) {
        setError(uploadError.message);
        toast({ 
          title: "Upload failed", 
          description: uploadError.message, 
          variant: "destructive" 
        });
      } else {
        setProgress(100);
        toast({ 
          title: "Upload successful", 
          description: "Your image has been uploaded" 
        });
        
        // Reset the form
        setFile(null);
        if (onUploadComplete) {
          onUploadComplete();
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError("An unexpected error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return {
    file,
    uploading,
    progress,
    error,
    handleFileChange,
    handleUpload,
    clearFile
  };
}
