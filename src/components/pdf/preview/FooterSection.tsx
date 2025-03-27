
import { PdfDesignFormValues } from "@/types/pdf";

interface FooterSectionProps {
  settings: PdfDesignFormValues;
}

export function FooterSection({ settings }: FooterSectionProps): string {
  let footerHtml = '';
  
  if (settings.footerText) {
    footerHtml += `
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666; padding: 15px; border-top: 1px solid #eee;">
        ${settings.footerText}
      </div>
    `;
  }
  
  if (settings.showPageNumbers) {
    footerHtml += `
      <div style="text-align: right; font-size: 10px; color: #999; padding: 10px 15px;">
        Page 1 of 3
      </div>
    `;
  }
  
  return footerHtml;
}
