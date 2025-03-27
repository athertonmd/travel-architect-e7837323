
import { Form } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { usePdfDesignForm } from "./hooks/usePdfDesignForm";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { PdfDesignFormValues } from "@/types/pdf";
import { FormHeader } from "./components/FormHeader";
import { TabContent } from "./components/TabContent";
import { FormSubmitButton } from "./components/FormSubmitButton";
import { PreviewSection } from "./components/PreviewSection";

export function PdfDesignForm() {
  const { form, isLoading, onSubmit } = usePdfDesignForm();
  const { toast } = useToast();
  const [saveProgress, setSaveProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("appearance");

  // Listen for quick links changes from the PdfPreview component
  useEffect(() => {
    const handleQuickLinksChange = (event: any) => {
      if (event.detail && event.detail.quickLinks) {
        // Update the form's quickLinks value
        form.setValue('quickLinks', event.detail.quickLinks);
      }
    };

    // Add event listener
    document.addEventListener('__INTERNAL_QUICK_LINKS_CHANGE', handleQuickLinksChange);

    // Clean up
    return () => {
      document.removeEventListener('__INTERNAL_QUICK_LINKS_CHANGE', handleQuickLinksChange);
    };
  }, [form]);

  const handleSubmit = async (values: PdfDesignFormValues) => {
    try {
      console.log("Form submission starting with values:", values);
      // Show initial progress
      setSaveProgress(30);
      
      await onSubmit(values);
      
      // Complete progress
      setSaveProgress(100);
      
      toast({
        title: "Settings saved",
        description: "Your PDF design settings have been saved successfully",
        variant: "default",
      });
      
      // Reset progress after a delay
      setTimeout(() => setSaveProgress(0), 1000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings",
        variant: "destructive",
      });
      setSaveProgress(0);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="appearance" className="w-full">
            <FormHeader 
              saveProgress={saveProgress}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <TabContent form={form} activeTab={activeTab} />
          </Tabs>
          
          <FormSubmitButton 
            isLoading={isLoading} 
            form={form} 
            onSubmit={handleSubmit} 
          />
        </form>
      </Form>
      
      <PreviewSection settings={form.watch()} />
    </div>
  );
}
