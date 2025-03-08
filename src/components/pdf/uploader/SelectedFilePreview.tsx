
import React from "react";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SelectedFilePreviewProps {
  file: File;
  uploading: boolean;
  progress: number;
  onUpload: () => void;
  onCancel: () => void;
}

export function SelectedFilePreview({ 
  file, 
  uploading, 
  progress, 
  onUpload, 
  onCancel 
}: SelectedFilePreviewProps) {
  return (
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
      
      {!uploading && (
        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            disabled={uploading}
          >
            Change
          </Button>
          <Button 
            size="sm" 
            onClick={onUpload}
            disabled={uploading}
          >
            Upload
          </Button>
        </div>
      )}
    </div>
  );
}
