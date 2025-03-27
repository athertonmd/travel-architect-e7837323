
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PdfDesignFormValues } from "@/types/pdf";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ContentTabProps {
  form: UseFormReturn<PdfDesignFormValues>;
}

export function ContentTab({ form }: ContentTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Display Options</h3>
        
        <FormField
          control={form.control}
          name="showPageNumbers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Page Numbers</FormLabel>
                <FormDescription>
                  Display page numbers at the bottom of each page
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="includeNotes"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Include Notes</FormLabel>
                <FormDescription>
                  Display notes and remarks in the itinerary
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="includeContactInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Include Contact Information</FormLabel>
                <FormDescription>
                  Display phone numbers and contact details
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="includeQuickLinks"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Include Quick Links</FormLabel>
                <FormDescription>
                  Display a section with customizable useful travel links. Your links will be saved automatically when you click "Save Settings".
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Alert variant="default" className="mb-4 border border-gold/30 bg-navy-light/30">
          <Info className="h-4 w-4 text-gold" />
          <AlertDescription className="text-sm">
            Changes to Quick Links in the preview section below will be saved when you click "Save Settings".
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Date & Time Format</h3>
        
        <FormField
          control={form.control}
          name="dateFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a date format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose how dates are displayed in your itinerary
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="timeFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="12h">12-hour (1:00 PM)</SelectItem>
                  <SelectItem value="24h">24-hour (13:00)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose how times are displayed in your itinerary
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
