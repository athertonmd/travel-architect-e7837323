
import { Progress } from "@/components/ui/progress";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      
      <div className="mb-6">
        <TabsList className="bg-navy-light w-full justify-start">
          <TabsTrigger 
            value="appearance" 
            onClick={() => setActiveTab("appearance")}
            data-state={activeTab === "appearance" ? "active" : "inactive"}
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            onClick={() => setActiveTab("content")}
            data-state={activeTab === "content" ? "active" : "inactive"}
          >
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="header"
            onClick={() => setActiveTab("header")}
            data-state={activeTab === "header" ? "active" : "inactive"}
          >
            Header & Footer
          </TabsTrigger>
          <TabsTrigger 
            value="sections"
            onClick={() => setActiveTab("sections")}
            data-state={activeTab === "sections" ? "active" : "inactive"}
          >
            Sections
          </TabsTrigger>
        </TabsList>
      </div>
    </>
  );
}
