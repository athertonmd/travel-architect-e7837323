
import { PdfPreview } from "../PdfPreview";
import { PdfDesignFormValues } from "@/types/pdf";

interface PreviewSectionProps {
  settings: PdfDesignFormValues;
}

export function PreviewSection({ settings }: PreviewSectionProps) {
  return (
    <div className="border-t pt-6 preview-section">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <PdfPreview settings={settings} />
    </div>
  );
}
