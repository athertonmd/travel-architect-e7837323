
import React from "react";
import { UploadDropzone } from "./uploader/UploadDropzone";
import { SelectedFilePreview } from "./uploader/SelectedFilePreview";
import { UploadGuidelines } from "./uploader/UploadGuidelines";
import { UploadError } from "./uploader/UploadError";
import { useImageUpload } from "./uploader/useImageUpload";

interface ImageUploaderProps {
  galleryType: "logo" | "banner";
  onUploadComplete: () => void;
}

export function ImageUploader({ galleryType, onUploadComplete }: ImageUploaderProps) {
  const {
    file,
    uploading,
    progress,
    error,
    handleFileChange,
    handleUpload,
    clearFile
  } = useImageUpload({ galleryType, onUploadComplete });

  return (
    <div className="space-y-4">
      <UploadError errorMessage={error || ""} />
      
      {!file ? (
        <UploadDropzone 
          galleryType={galleryType} 
          onFileSelect={handleFileChange} 
        />
      ) : (
        <SelectedFilePreview
          file={file}
          uploading={uploading}
          progress={progress}
          onUpload={handleUpload}
          onCancel={clearFile}
        />
      )}
      
      <UploadGuidelines galleryType={galleryType} />
    </div>
  );
}
