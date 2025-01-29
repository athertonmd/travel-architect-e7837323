import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PdfErrorStateProps {
  error: string;
  onRetry: () => void;
  isGenerating: boolean;
}

export function PdfErrorState({ error, onRetry, isGenerating }: PdfErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <FileText className="h-12 w-12 text-red-400" />
      <p className="text-red-600 text-center">{error}</p>
      <Button onClick={onRetry} disabled={isGenerating}>
        Try Again
      </Button>
    </div>
  );
}