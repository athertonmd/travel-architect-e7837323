
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";

interface FormSubmitButtonProps {
  isLoading: boolean;
  form: UseFormReturn<PdfDesignFormValues>;
  onSubmit: (values: PdfDesignFormValues) => Promise<void>;
}

export function FormSubmitButton({ isLoading, form, onSubmit }: FormSubmitButtonProps) {
  return (
    <div className="flex justify-end sticky bottom-2 pt-4 bg-background pb-2">
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="min-w-[140px]"
        variant="default"
        onClick={() => {
          console.log("Save button clicked");
          // Force the form to submit when the button is clicked
          form.handleSubmit(onSubmit)();
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </div>
  );
}
