
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { SabreCredentialsFormValues } from "@/types/sabre";
import { SabreCredentialsRow } from "@/integrations/supabase/types/sabre-credentials";

export function useSabreCredentials() {
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
          // Type guard to check if data is a valid SabreCredentialsRow
          const credentials = data as SabreCredentialsRow;
          
          // Pre-populate form with existing data
          form.reset({
            pcc_p4uh: credentials.pcc_p4uh || "",
            pcc_p4sh: credentials.pcc_p4sh || "",
            queue_assignment: credentials.queue_assignment || "",
            queue_number: credentials.queue_number || "",
            fnbts_entry: credentials.fnbts_entry || "FNBTS-P4UH/xxx/11-MANTIC POINT",
            additional_notes: credentials.additional_notes || "",
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
          .update(values as any)
          .eq('id', data.id);
      } else {
        // Insert new record
        result = await supabase
          .from('sabre_credentials')
          .insert({
            ...values,
            user_id: session.user.id
          } as any);
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

  return {
    isLoading,
    isSaving,
    form,
    onSubmit
  };
}
