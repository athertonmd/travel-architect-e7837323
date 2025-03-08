
import React from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  galleryType: "logo" | "banner";
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadDropzone({ galleryType, onFileSelect }: UploadDropzoneProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
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
        onChange={onFileSelect}
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
    </div>
  );
}
