import { FileText } from "lucide-react";

interface PdfLoadingStateProps {
  message: string;
}

export function PdfLoadingState({ message }: PdfLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      {message === "Generating PDF..." ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      ) : (
        <FileText className="h-12 w-12 text-gray-400" />
      )}
      <p className="text-gray-600">{message}</p>
    </div>
  );
}