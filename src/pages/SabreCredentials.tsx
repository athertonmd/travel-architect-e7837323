
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FileKey, Info, Loader2, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface SabreCredentialsFormValues {
  pcc_p4uh: string;
  pcc_p4sh: string;
  queue_assignment: string;
  queue_number: string;
  fnbts_entry: string;
  additional_notes: string;
}

export default function SabreCredentials() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  
  const form = useForm<SabreCredentialsFormValues>({
    defaultValues: {
      pcc_p4uh: "",
      pcc_p4sh: "",
      queue_assignment: "",
      queue_number: "",
      fnbts_entry: "FNBTS-P4UH/xxx/11-MANTIC POINT",
      additional_notes: "",
    },
  });
  
  // Fetch existing Sabre credentials when the component mounts
  useEffect(() => {
    const fetchSabreCredentials = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('sabre_credentials')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching Sabre credentials:", error);
          toast.error("Failed to load your Sabre credentials");
        } else if (data) {
          // Pre-populate form with existing data
          form.reset({
            pcc_p4uh: data.pcc_p4uh || "",
            pcc_p4sh: data.pcc_p4sh || "",
            queue_assignment: data.queue_assignment || "",
            queue_number: data.queue_number || "",
            fnbts_entry: data.fnbts_entry || "FNBTS-P4UH/xxx/11-MANTIC POINT",
            additional_notes: data.additional_notes || "",
          });
          toast.info("Loaded your existing Sabre credentials");
        }
      } catch (error) {
        console.error("Error in fetch operation:", error);
        toast.error("Something went wrong while loading your credentials");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSabreCredentials();
  }, [session, form]);
  
  const onSubmit = async (values: SabreCredentialsFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save credentials");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Check if credentials already exist for this user
      const { data } = await supabase
        .from('sabre_credentials')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      let result;
      
      if (data) {
        // Update existing record
        result = await supabase
          .from('sabre_credentials')
          .update(values)
          .eq('id', data.id);
      } else {
        // Insert new record
        result = await supabase
          .from('sabre_credentials')
          .insert({
            ...values,
            user_id: session.user.id
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Sabre credentials saved successfully");
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto" />
            <p className="text-white/80">Loading your Sabre credentials...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileKey className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-bold tracking-tight">Sabre Credentials</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>GDS Requirements – Setting Up a New Sabre TMC</CardTitle>
            <CardDescription>
              Please provide your Sabre GDS credentials to enable integration with Tripscape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-navy-light border-gold/20">
              <Info className="h-4 w-4 text-gold" />
              <AlertTitle className="text-gold">How we use this information</AlertTitle>
              <AlertDescription className="text-white/90">
                Tripscape uses these Sabre credentials to access PNR data via Sabre Queue Placement (QP). 
                This allows us to automatically retrieve and process your booking information.
              </AlertDescription>
            </Alert>
            
            <div className="mb-6 p-4 border border-gold/20 rounded-md bg-navy-light/50">
              <h3 className="text-lg font-medium mb-2 text-gold">Sabre Integration Process</h3>
              <ol className="list-decimal list-inside space-y-3 text-white/90">
                <li>
                  The TMC will set-up a Branch Access with Sabre for all required PCCs with the Mantic Point PCCs: 
                  <span className="bg-yellow-300/90 text-navy px-1 mx-1 font-medium">P4UH</span> and
                  <span className="bg-yellow-300/90 text-navy px-1 mx-1 font-medium">P4SH</span> to allow access to read PNR data via Sabre Queue Placement (QP)
                </li>
                <li>The TMC will advise Mantic Point once the process has been completed</li>
                <li>Mantic Point developer team will assign a tripscape queue</li>
                <li>Mantic Point will advise the TMC once the access has been granted by Sabre</li>
                <li>
                  The TMC will queue all or certain PNRs to Mantic Point's PCC: 
                  <span className="bg-yellow-300/90 text-navy px-1 mx-1 font-medium">P4UH</span>
                </li>
              </ol>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="pcc_p4uh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pseudo City Code (PCC) - P4UH</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your P4UH PCC" />
                        </FormControl>
                        <FormDescription>
                          Primary PCC for Sabre integration
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pcc_p4sh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pseudo City Code (PCC) - P4SH</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your P4SH PCC" />
                        </FormControl>
                        <FormDescription>
                          Secondary PCC for Sabre integration
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="queue_assignment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tripscape Sabre Queue Assignment</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., TSC1" />
                        </FormControl>
                        <FormDescription>
                          The designated queue for Tripscape
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
                          P4UH Queue number for PNR placement
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="fnbts_entry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FNBTS Entry</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: FNBTS-P4UH/xxx/11-MANTIC POINT
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
                          placeholder="Any additional information or requirements for your Sabre setup"
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
                    className="bg-gold hover:bg-gold-light text-navy"
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
          </CardContent>
        </Card>
        
        <div className="text-sm text-white/70 p-4 bg-navy-light/50 rounded-md border border-white/10">
          <p className="font-medium mb-2">Note:</p>
          <p>You may also consider entering an FNBTS- entry to the agency level or specific company level profile, so that all PNR's get queued to the Mantic Point PCC and queue at end transact.</p>
          <p className="mt-2">Example entry: <code className="bg-navy-light px-2 py-1 rounded">FNBTS-P4UH/xxx/11-MANTIC POINT</code></p>
        </div>
      </div>
    </Layout>
  );
}
