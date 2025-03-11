
import { TabsContent } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";
import { PdfDesignFormValues } from "@/types/pdf";
import { AppearanceTab } from "../tabs/AppearanceTab";
import { ContentTab } from "../tabs/ContentTab";
import { HeaderFooterTab } from "../tabs/HeaderFooterTab";
import { SectionsTab } from "../tabs/SectionsTab";

interface TabContentProps {
  form: UseFormReturn<PdfDesignFormValues>;
  activeTab: string;
}

export function TabContent({ form, activeTab }: TabContentProps) {
  return (
    <>
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
    </>
  );
}
