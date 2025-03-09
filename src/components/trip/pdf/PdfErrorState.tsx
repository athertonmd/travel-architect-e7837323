
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        <AlertTitle>PDF Generation Failed</AlertTitle>
        <AlertDescription className="mt-2 text-sm">{error}</AlertDescription>
      </Alert>
      
      <div className="text-sm text-gray-600 max-w-md text-center">
        <p>This could be due to:</p>
        <ul className="list-disc pl-5 mt-2 text-left">
          <li>Authentication issues - try logging out and back in</li>
          <li>Server timeout - the PDF may take too long to generate</li>
          <li>Missing or incomplete trip information</li>
          <li>Connection problems with the server</li>
        </ul>
      </div>
      
      <Button 
        onClick={onRetry} 
        disabled={isGenerating}
        variant="default"
        className="min-w-[120px] gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
        {isGenerating ? "Retrying..." : "Try Again"}
      </Button>
    </div>
  );
}
