
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FontSelector } from "../FontSelector";
import { ColorSelector } from "../ColorSelector";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";

interface AppearanceTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function AppearanceTab({ form }: AppearanceTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="primaryColor"
          render={({ field }) => (
            <FormItem className="color-selector-step">
              <FormLabel>Primary Color</FormLabel>
              <ColorSelector value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="secondaryColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Color</FormLabel>
              <ColorSelector value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accentColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accent Color</FormLabel>
              <ColorSelector value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="headerFont"
          render={({ field }) => (
            <FormItem className="font-selector-step">
              <FormLabel>Header Font</FormLabel>
              <FontSelector value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bodyFont"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Font</FormLabel>
              <FontSelector value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} className="text-white" />
              </FormControl>
              <FormDescription>
                Enter a URL to your company logo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
