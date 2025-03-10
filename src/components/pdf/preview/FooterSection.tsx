
import { PdfDesignFormValues } from "@/types/pdf";

interface FooterSectionProps {
  settings: PdfDesignFormValues;
}

export function FooterSection({ settings }: FooterSectionProps) {
  return (
    <>
      {settings.footerText && (
        <div style={{ marginTop: "30px", textAlign: "center", fontSize: "12px", color: "#666", padding: "15px", borderTop: "1px solid #eee" }}>
          {settings.footerText}
        </div>
      )}
      
      {settings.showPageNumbers && (
        <div style={{ textAlign: "right", fontSize: "10px", color: "#999", padding: "10px 15px" }}>
          Page 1 of 3
        </div>
      )}
    </>
  );
}
