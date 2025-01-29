import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PdfErrorStateProps {
  error: string;
  onRetry: () => void;
  isGenerating: boolean;
}

export function PdfErrorState({ error, onRetry, isGenerating }: PdfErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <Button 
        onClick={onRetry} 
        disabled={isGenerating}
        variant="outline"
        className="min-w-[120px]"
      >
        {isGenerating ? "Retrying..." : "Try Again"}
      </Button>
    </div>
  );
}