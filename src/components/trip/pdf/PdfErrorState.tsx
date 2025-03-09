
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface PdfErrorStateProps {
  error: string;
  errorDetails?: string | null;
  onRetry: () => void;
  isGenerating: boolean;
}

export function PdfErrorState({ error, errorDetails, onRetry, isGenerating }: PdfErrorStateProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Extract more specific error message if available
  const displayError = error.includes("PDF creation error:") 
    ? error 
    : error.includes("Edge Function") || error.includes("non-2xx status code")
      ? "Server error: The PDF service encountered an issue. Please ensure your trip has segments and try again later."
      : error.includes("No segments")
      ? "This trip doesn't have any content to generate a PDF from. Please add some segments to your trip first."
      : error;
  
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>PDF Generation Failed</AlertTitle>
        <AlertDescription className="mt-2 text-sm whitespace-pre-wrap">{displayError}</AlertDescription>
      </Alert>
      
      <div className="text-sm text-gray-600 max-w-md text-center">
        <p>This could be due to:</p>
        <ul className="list-disc pl-5 mt-2 text-left">
          <li>Empty trip - please add segments to your trip</li>
          <li>Authentication issues - try logging out and back in</li>
          <li>Server timeout - the PDF may take too long to generate</li>
          <li>Missing or incomplete trip information</li>
          <li>Connection problems with the server</li>
        </ul>
      </div>
      
      {errorDetails && (
        <Collapsible className="w-full max-w-md" open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {detailsOpen ? "Hide Technical Details" : "Show Technical Details"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 mt-2 bg-gray-100 rounded-md text-xs font-mono overflow-auto max-h-32">
              {errorDetails}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
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
