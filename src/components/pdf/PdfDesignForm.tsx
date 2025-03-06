
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PdfPreview } from "./PdfPreview";
import { PdfDesignFormValues } from "@/types/pdf";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { ContentTab } from "./tabs/ContentTab";
import { HeaderFooterTab } from "./tabs/HeaderFooterTab";
import { SectionsTab } from "./tabs/SectionsTab";
import { usePdfSettings } from "./hooks/usePdfSettings";

const formSchema = z.object({
  // Appearance settings
  primaryColor: z.string().default("#1A1F2C"),
  secondaryColor: z.string().default("#D6BCFA"),
  accentColor: z.string().default("#9b87f5"),
  headerFont: z.string().default("Helvetica"),
  bodyFont: z.string().default("Helvetica"),
  logoUrl: z.string().optional(),
  
  // Content settings
  showPageNumbers: z.boolean().default(true),
  includeNotes: z.boolean().default(true),
  includeContactInfo: z.boolean().default(true),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  timeFormat: z.enum(["12h", "24h"]).default("12h"),
  
  // Header settings
  companyName: z.string().optional(),
  headerText: z.string().optional(),
  footerText: z.string().optional(),
});

export function PdfDesignForm() {
  // Initialize form with default values
  const form = useForm<PdfDesignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: "#1A1F2C",
      secondaryColor: "#D6BCFA",
      accentColor: "#9b87f5",
      headerFont: "Helvetica",
      bodyFont: "Helvetica",
      showPageNumbers: true,
      includeNotes: true,
      includeContactInfo: true,
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
  });

  const { isLoading, saveSettings } = usePdfSettings(form);

  const onSubmit = async (values: PdfDesignFormValues) => {
    await saveSettings(values);
  };

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
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <PdfPreview settings={form.watch()} />
      </div>
    </div>
  );
}
