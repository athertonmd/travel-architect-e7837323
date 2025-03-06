import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { SabreCredentialsFormValues } from "@/types/sabre";
import { useSabreCredentials } from "@/hooks/useSabreCredentials";
export function SabreCredentialForm() {
  const {
    isSaving,
    form,
    onSubmit
  } = useSabreCredentials();
  return <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="pcc_p4uh" render={({
          field
        }) => <FormItem>
                <FormLabel>Pseudo City Code (PCC) - P4UH</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your P4UH PCC" />
                </FormControl>
                <FormDescription>
                  Primary PCC for Sabre integration
                </FormDescription>
              </FormItem>} />
          
          <FormField control={form.control} name="pcc_p4sh" render={({
          field
        }) => <FormItem>
                <FormLabel>Pseudo City Code (PCC) - P4SH</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your P4SH PCC" />
                </FormControl>
                <FormDescription>
                  Secondary PCC for Sabre integration
                </FormDescription>
              </FormItem>} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="queue_assignment" render={({
          field
        }) => <FormItem>
                <FormLabel>Trip Builder Sabre Queue Assignment</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., TSC1" />
                </FormControl>
                <FormDescription>The designated queue for Trip Builder</FormDescription>
              </FormItem>} />
          
          <FormField control={form.control} name="queue_number" render={({
          field
        }) => <FormItem>
                <FormLabel>Queue Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 300" />
                </FormControl>
                <FormDescription>
                  P4UH Queue number for PNR placement
                </FormDescription>
              </FormItem>} />
        </div>
        
        <FormField control={form.control} name="fnbts_entry" render={({
        field
      }) => <FormItem>
              <FormLabel>FNBTS Entry</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Format: FNBTS-P4UH/xxx/11-MANTIC POINT
              </FormDescription>
            </FormItem>} />
        
        <FormField control={form.control} name="additional_notes" render={({
        field
      }) => <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Any additional information or requirements for your Sabre setup" className="min-h-[100px]" />
              </FormControl>
            </FormItem>} />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="bg-gold hover:bg-gold-light text-navy">
            {isSaving ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </> : <>
                Save Credentials
                <Save className="ml-2 h-4 w-4" />
              </>}
          </Button>
        </div>
      </form>
    </Form>;
}