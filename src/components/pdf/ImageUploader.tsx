
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, File, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImageUploaderProps {
  galleryType: "logo" | "banner";
  onUploadComplete: () => void;
}

export function ImageUploader({ galleryType, onUploadComplete }: ImageUploaderProps) {
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

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        {!file ? (
          <>
            <div className="mx-auto flex justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {galleryType === 'logo' ? 
                'Upload a logo image to use in your itinerary header' : 
                'Upload a banner image to use as your itinerary header background'}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG or GIF up to 2MB
            </p>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Select image
              </label>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <File className="h-10 w-10 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            
            {uploading && (
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-xs text-gray-500">Uploading... {progress.toFixed(0)}%</p>
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              {!uploading && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setFile(null)}
                    disabled={uploading}
                  >
                    Change
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    Upload
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-sm">
        <h3 className="font-medium">{galleryType === 'logo' ? 'Logo' : 'Banner'} image guidelines:</h3>
        <ul className="list-disc pl-5 text-gray-500 mt-1 text-xs">
          {galleryType === 'logo' ? (
            <>
              <li>Keep your logo simple and recognizable</li>
              <li>Recommended size: 200px x 80px</li>
              <li>Transparent background (PNG) works best</li>
              <li>Will appear in the top section of your itinerary</li>
            </>
          ) : (
            <>
              <li>Use high-quality landscape-oriented images</li>
              <li>Recommended size: 1000px x 250px</li>
              <li>Will span across the top of your itinerary</li>
              <li>Dark or muted images work best with overlaid text</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
