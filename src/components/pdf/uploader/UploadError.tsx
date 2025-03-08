
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadErrorProps {
  errorMessage: string;
}

export function UploadError({ errorMessage }: UploadErrorProps) {
  if (!errorMessage) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}
