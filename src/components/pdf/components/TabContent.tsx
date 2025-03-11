
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
      <TabsContent value="appearance" className="space-y-6" forceMount hidden={activeTab !== "appearance"}>
        <AppearanceTab form={form} />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-6" forceMount hidden={activeTab !== "content"}>
        <ContentTab form={form} />
      </TabsContent>
      
      <TabsContent value="header" className="space-y-6" forceMount hidden={activeTab !== "header"}>
        <HeaderFooterTab form={form} />
      </TabsContent>
      
      <TabsContent value="sections" className="space-y-6" forceMount hidden={activeTab !== "sections"}>
        <SectionsTab form={form} />
      </TabsContent>
    </>
  );
}
