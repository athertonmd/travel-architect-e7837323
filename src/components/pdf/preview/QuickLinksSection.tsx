
import { PdfDesignFormValues } from "@/types/pdf";
import { QuickLink } from "../PdfPreview";

interface QuickLinksSectionProps {
  settings: PdfDesignFormValues;
  quickLinks?: QuickLink[];
}

export function QuickLinksSection({ settings, quickLinks = [] }: QuickLinksSectionProps): string {
  const links = quickLinks.length > 0 ? quickLinks : [
    { name: "Company Portal", url: "#" },
    { name: "Weather", url: "#" },
    { name: "Visa & Passport", url: "#" },
    { name: "Currency Converter", url: "#" },
    { name: "World Clock", url: "#" },
  ];

  return `
    <div style="margin-top: 30px;">
      <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
        <div style="font-weight: bold;">QUICK LINKS</div>
      </div>
      <div style="padding: 15px; display: flex; flex-wrap: wrap; gap: 15px;">
        ${links.map(link => `
          <a href="${link.url}" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;" target="_blank">
            <span style="width: 24px; height: 24px; background-color: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
            ${link.name}
          </a>
        `).join('')}
      </div>
    </div>
  `;
}
