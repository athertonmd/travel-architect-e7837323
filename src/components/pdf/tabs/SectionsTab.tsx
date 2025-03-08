
import { FormLabel, FormDescription } from "@/components/ui/form";
import { PdfSectionOrder } from "../PdfSectionOrder";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SectionsTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function SectionsTab({ form }: SectionsTabProps) {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4 border border-gold/30 bg-navy-light/30">
        <Info className="h-4 w-4 text-gold" />
        <AlertDescription className="text-sm">
          Trip header is always shown at the top of the itinerary. Segment sections (Flight, Hotel, Car, etc.) 
          are displayed in chronological order based on dates.
        </AlertDescription>
      </Alert>
      
      <div>
        <FormLabel className="block mb-2">Optional Sections</FormLabel>
        <FormDescription className="mb-4">
          Drag and drop to rearrange or toggle to include/exclude these sections
        </FormDescription>
        <PdfSectionOrder />
      </div>
    </div>
  );
}
