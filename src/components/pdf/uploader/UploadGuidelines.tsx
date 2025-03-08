
import React from "react";

interface UploadGuidelinesProps {
  galleryType: "logo" | "banner";
}

export function UploadGuidelines({ galleryType }: UploadGuidelinesProps) {
  return (
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
  );
}
