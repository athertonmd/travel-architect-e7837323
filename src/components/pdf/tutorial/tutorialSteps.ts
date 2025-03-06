
export interface TutorialStep {
  title: string;
  description: string;
  target: string;
  position: "right" | "left" | "top" | "bottom";
}

export const tutorialSteps: TutorialStep[] = [
  {
    title: "Choose your colors",
    description: "Select primary, secondary, and accent colors that match your brand identity",
    target: ".color-selector-step",
    position: "right"
  },
  {
    title: "Select fonts",
    description: "Choose appropriate fonts for headers and body text",
    target: ".font-selector-step",
    position: "right"
  },
  {
    title: "Customize content",
    description: "Toggle which elements to include in your PDF exports",
    target: "button[value='content']",
    position: "top"
  },
  {
    title: "Add company details",
    description: "Include your company name and branding information",
    target: "button[value='header']",
    position: "top"
  },
  {
    title: "Preview your design",
    description: "See a live preview of how your PDF will look",
    target: ".preview-section",
    position: "top"
  }
];
