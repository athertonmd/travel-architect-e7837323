import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PdfDialogTriggerProps {
  onClick: () => void;
}

export function PdfDialogTrigger({ onClick }: PdfDialogTriggerProps) {
  const handleClick = () => {
    console.log("PDF button clicked");
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-navy hover:bg-navy-light border border-white text-white"
    >
      <FileText className="mr-2 h-4 w-4" />
      PDF
    </Button>
  );
}