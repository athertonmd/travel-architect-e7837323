
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PdfDesignFormValues, mapDbSettingsToFormValues, mapFormValuesToDbSettings } from "@/types/pdf";
import { UseFormReturn } from "react-hook-form";
import { getAuthenticatedSession } from "@/utils/pdf/sessionUtils";

export function usePdfSettings(form: UseFormReturn<PdfDesignFormValues>) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session?.user?.id) {
          console.log("No user session found");
          setIsLoading(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Loading PDF settings for user:", userId);
        
        const { data, error } = await supabase
          .rpc('get_pdf_settings_for_user', { user_id_param: userId });
          
        if (error) {
          console.error('Error loading PDF settings:', error);
          throw error;
        }
        
        if (data) {
          console.log("Found PDF settings:", data);
          
          // Ensure data is an object before checking properties
          if (typeof data === 'object' && data !== null) {
            // Check if quick_links is missing in the data
            if (!('quick_links' in data) || data.quick_links === null) {
              console.log("quick_links not found in data, fetching separately");
              try {
                // Fallback for getting quick links separately if needed
                const { data: quickLinksData, error: quickLinksError } = await supabase
                  .from('pdf_settings')
                  .select('quick_links')
                  .eq('user_id', userId)
                  .single();
                  
                if (quickLinksError) {
                  console.error('Error loading quick links:', quickLinksError);
                } else if (quickLinksData && quickLinksData.quick_links) {
                  // Merge the quick links with the other settings
                  data.quick_links = quickLinksData.quick_links;
                } else {
                  // Provide default empty array if quick_links is still missing
                  data.quick_links = [];
                }
              } catch (err) {
                console.error('Error in quick links fallback:', err);
                // Ensure we have a default value
                data.quick_links = [];
              }
            }
          } else {
            console.error('Data returned from get_pdf_settings_for_user is not an object:', data);
            // Handle unexpected data format by creating a new object
            data = { quick_links: [] };
          }
          
          form.reset(mapDbSettingsToFormValues(data));
        } else {
          console.log("No PDF settings found for user");
        }
      } catch (error) {
        console.error('Error loading PDF settings:', error);
        toast({
          title: "Error loading settings",
          description: "There was a problem loading your settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [form, toast]);

  const saveSettings = async (values: PdfDesignFormValues) => {
    console.log("Starting saveSettings function with values:", values);
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to save PDF settings",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const userId = sessionData.session.user.id;
      const dbValues = mapFormValuesToDbSettings(values, userId);
      
      console.log("Saving PDF settings:", dbValues);
      
      // Add a slight delay to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Using the unique constraint on user_id for the upsert operation
      const { error } = await supabase
        .from('pdf_settings')
        .upsert(dbValues, {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        });
        
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log("Settings saved successfully");
      
      // Add a small delay after successful save to ensure loading state is visible
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Error saving PDF settings:', error);
      throw error; // Re-throw the error so the component can handle it
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    saveSettings
  };
}
