
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { TravelportCredentialsFormValues } from "@/types/travelport";

export function useTravelportCredentials() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  
  const form = useForm<TravelportCredentialsFormValues>({
    defaultValues: {
      pcc: "",
      profile_name: "",
      branch_id: "",
      queue_number: "",
      signatory: "",
      additional_notes: "",
    },
  });
  
  // Fetch existing Travelport credentials when the component mounts
  useEffect(() => {
    const fetchTravelportCredentials = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('travelport_credentials')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching Travelport credentials:", error);
          toast.error("Failed to load your Travelport credentials");
        } else if (data) {
          // Pre-populate form with existing data
          form.reset({
            pcc: data.pcc || "",
            profile_name: data.profile_name || "",
            branch_id: data.branch_id || "",
            queue_number: data.queue_number || "",
            signatory: data.signatory || "",
            additional_notes: data.additional_notes || "",
          });
          toast.info("Loaded your existing Travelport credentials");
        }
      } catch (error) {
        console.error("Error in fetch operation:", error);
        toast.error("Something went wrong while loading your credentials");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelportCredentials();
  }, [session, form]);
  
  const onSubmit = async (values: TravelportCredentialsFormValues) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to save credentials");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Check if credentials already exist for this user
      const { data } = await supabase
        .from('travelport_credentials')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      let result;
      
      if (data) {
        // Update existing record
        result = await supabase
          .from('travelport_credentials')
          .update(values)
          .eq('id', data.id);
      } else {
        // Insert new record
        result = await supabase
          .from('travelport_credentials')
          .insert({
            ...values,
            user_id: session.user.id
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Travelport credentials saved successfully");
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
