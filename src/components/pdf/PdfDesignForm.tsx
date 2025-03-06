
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PdfPreview } from "./PdfPreview";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { ContentTab } from "./tabs/ContentTab";
import { HeaderFooterTab } from "./tabs/HeaderFooterTab";
import { SectionsTab } from "./tabs/SectionsTab";
import { usePdfDesignForm } from "./hooks/usePdfDesignForm";

export function PdfDesignForm() {
  const { form, isLoading, onSubmit } = usePdfDesignForm();

  return (
    <div className="flex flex-col space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              {isLoading ? "Saving..." : "Save Settings"}
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
