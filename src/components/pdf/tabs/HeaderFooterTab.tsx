
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { ImagePickerDialog } from "../ImagePickerDialog";

interface HeaderFooterTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function HeaderFooterTab({ form }: HeaderFooterTabProps) {
  const [isBannerPickerOpen, setIsBannerPickerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="bannerImageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner Image</FormLabel>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <FormControl>
                  <Input placeholder="https://example.com/banner.jpg" {...field} value={field.value || ""} />
                </FormControl>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsBannerPickerOpen(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
            <FormDescription>
              Select a banner image to span the full width of the header area
            </FormDescription>
            {field.value && (
              <div className="mt-2 border rounded p-1 overflow-hidden">
                <img 
                  src={field.value} 
                  alt="Banner preview" 
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Your Company Name" {...field} value={field.value || ""} />
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
              <Input placeholder="Custom header text" {...field} value={field.value || ""} />
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
              <Input placeholder="Custom footer text" {...field} value={field.value || ""} />
            </FormControl>
            <FormDescription>
              Text to display in the footer of each page
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {isBannerPickerOpen && (
        <ImagePickerDialog
          isOpen={isBannerPickerOpen}
          onClose={() => setIsBannerPickerOpen(false)}
          onSelect={(url) => form.setValue('bannerImageUrl', url)}
          currentImageUrl={form.watch('bannerImageUrl')}
          title="Select Banner Image"
          description="Choose a banner image to display across the top of your itinerary"
          galleryType="banner"
        />
      )}
    </div>
  );
}
