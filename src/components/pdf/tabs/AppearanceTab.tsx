
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FontSelector } from "../FontSelector";
import { ColorSelector } from "../ColorSelector";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { ImagePickerDialog } from "../ImagePickerDialog";

interface AppearanceTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function AppearanceTab({ form }: AppearanceTabProps) {
  const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);

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
              <FormLabel>Company Logo</FormLabel>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} className="text-white" />
                  </FormControl>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLogoPickerOpen(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
              <FormDescription>
                Select a logo to display in your itinerary header
              </FormDescription>
              {field.value && (
                <div className="mt-2 border rounded p-2 w-full max-w-[200px]">
                  <img 
                    src={field.value} 
                    alt="Selected logo" 
                    className="max-h-16 object-contain"
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {isLogoPickerOpen && (
        <ImagePickerDialog
          isOpen={isLogoPickerOpen}
          onClose={() => setIsLogoPickerOpen(false)}
          onSelect={(url) => form.setValue('logoUrl', url)}
          currentImageUrl={form.watch('logoUrl')}
          title="Select Company Logo"
          description="Choose a logo to display in your itinerary header"
          galleryType="logo"
        />
      )}
    </div>
  );
}
