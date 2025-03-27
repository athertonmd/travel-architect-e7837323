
import { PdfDesignFormValues } from "@/types/pdf";

interface HeaderSectionProps {
  settings: PdfDesignFormValues;
}

export function HeaderSection({ settings }: HeaderSectionProps): string {
  if (settings.bannerImageUrl) {
    return `
      <div style="text-align: center; position: relative; width: 100%;">
        <img src="${settings.bannerImageUrl}" alt="Header Banner" style="width: 100%; max-height: 200px; object-fit: cover;" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%;">
          <div style="background-color: rgba(0,0,0,0.5); display: inline-block; padding: 8px 20px; border-radius: 4px;">
            <h2 style="margin: 5px 0; color: white; font-family: ${settings.headerFont}, sans-serif; text-shadow: 1px 1px 3px rgba(0,0,0,0.7);">
              ${settings.companyName || 'Global Travel Company'}
            </h2>
            <div style="font-size: 14px; margin-top: 5px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">
              ${settings.headerText || 'Corporate Travel Department'}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  return `
    <div style="text-align: center; background-color: #1a365d; color: white; padding: 15px 0;">
      ${settings.logoUrl ? 
        `<img src="${settings.logoUrl}" alt="Logo" style="max-height: 70px; margin-bottom: 10px;" />` : 
        '<div style="width: 100px; height: 50px; background-color: #e2e8f0; margin: 0 auto;"></div>'
      }
      <h2 style="margin: 5px 0; color: white; font-family: ${settings.headerFont}, sans-serif;">
        ${settings.companyName || 'Global Travel Company'}
      </h2>
      <div style="font-size: 14px; margin-top: 5px;">
        ${settings.headerText || 'Corporate Travel Department'}
      </div>
    </div>
  `;
}
