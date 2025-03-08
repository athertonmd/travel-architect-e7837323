
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PdfPreview } from "./PdfPreview";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { ContentTab } from "./tabs/ContentTab";
import { HeaderFooterTab } from "./tabs/HeaderFooterTab";
import { SectionsTab } from "./tabs/SectionsTab";
import { usePdfDesignForm } from "./hooks/usePdfDesignForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress"; 

export function PdfDesignForm() {
  const { form, isLoading, onSubmit } = usePdfDesignForm();
  const { toast } = useToast();
  const [saveProgress, setSaveProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("appearance");

  const handleSubmit = async (values: any) => {
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
          {saveProgress > 0 && (
            <div className="mb-4">
              <Progress value={saveProgress} className="h-1 w-full" />
            </div>
          )}
          
          <Tabs 
            defaultValue="appearance" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-navy-light w-full justify-start mb-6">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="header">Header & Footer</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <AppearanceTab form={form} />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <ContentTab form={form} />
            </TabsContent>
            
            <TabsContent value="header" className="space-y-6">
              <HeaderFooterTab form={form} />
            </TabsContent>
            
            <TabsContent value="sections" className="space-y-6">
              <SectionsTab form={form} />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end sticky bottom-2 pt-4 bg-background pb-2">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="min-w-[140px]"
              variant="default"
              onClick={() => {
                console.log("Save button clicked");
                // Force the form to submit when the button is clicked
                // This provides another way to trigger the submission
                form.handleSubmit(handleSubmit)();
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="border-t pt-6 preview-section">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <PdfPreview settings={form.watch()} />
      </div>
    </div>
  );
}
