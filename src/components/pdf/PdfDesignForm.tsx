
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

export function PdfDesignForm() {
  const { form, isLoading, onSubmit } = usePdfDesignForm();
  const { toast } = useToast();

  const handleSubmit = async (values: any) => {
    try {
      console.log("Form submitted with values:", values);
      await onSubmit(values);
      toast({
        title: "Settings saved",
        description: "Your PDF design settings have been saved successfully"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Tabs defaultValue="appearance" className="w-full">
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
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
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
