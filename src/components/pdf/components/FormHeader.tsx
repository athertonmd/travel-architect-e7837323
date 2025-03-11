
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormHeaderProps {
  saveProgress: number;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function FormHeader({ saveProgress, activeTab, setActiveTab }: FormHeaderProps) {
  return (
    <>
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
      </Tabs>
    </>
  );
}
