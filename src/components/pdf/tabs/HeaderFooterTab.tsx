
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";

interface HeaderFooterTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function HeaderFooterTab({ form }: HeaderFooterTabProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Company Name" {...field} className="text-white" />
            </FormControl>
            <FormDescription>
              This will appear in the header of your PDF
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="headerText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Header Text</FormLabel>
            <FormControl>
              <Input placeholder="Custom header text" {...field} className="text-white" />
            </FormControl>
            <FormDescription>
              Additional text to display in the header
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="footerText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Footer Text</FormLabel>
            <FormControl>
              <Input placeholder="Custom footer text" {...field} className="text-white" />
            </FormControl>
            <FormDescription>
              Text to display in the footer of each page
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
