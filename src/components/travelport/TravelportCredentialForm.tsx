
import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useTravelportCredentials } from "@/hooks/useTravelportCredentials";

export function TravelportCredentialForm() {
  const { isSaving, form, onSubmit } = useTravelportCredentials();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField 
            control={form.control} 
            name="pcc" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pseudo City Code (PCC)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your PCC" />
                </FormControl>
                <FormDescription>
                  Primary PCC for Travelport integration
                </FormDescription>
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="profile_name" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your profile name" />
                </FormControl>
                <FormDescription>
                  Your Travelport profile identifier
                </FormDescription>
              </FormItem>
            )} 
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField 
            control={form.control} 
            name="branch_id" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., B001" />
                </FormControl>
                <FormDescription>
                  Branch identifier for your Travelport account
                </FormDescription>
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="queue_number" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queue Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 300" />
                </FormControl>
                <FormDescription>
                  Queue number for PNR placement
                </FormDescription>
              </FormItem>
            )} 
          />
        </div>
        
        <FormField 
          control={form.control} 
          name="signatory" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signatory</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter signatory information" />
              </FormControl>
              <FormDescription>
                Travelport signatory information for ticketing
              </FormDescription>
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="additional_notes" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Any additional information or requirements for your Travelport setup" 
                  className="min-h-[100px]" 
                />
              </FormControl>
            </FormItem>
          )} 
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving} 
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Credentials
                <Save className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
