
import { FormLabel, FormDescription } from "@/components/ui/form";
import { PdfSectionOrder } from "../PdfSectionOrder";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";

interface SectionsTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function SectionsTab({ form }: SectionsTabProps) {
  return (
    <div className="space-y-6">
      <FormLabel className="block mb-4">Section Order</FormLabel>
      <FormDescription className="mb-4">
        Drag and drop sections to rearrange how they appear in your PDF
      </FormDescription>
      <PdfSectionOrder />
    </div>
  );
}
