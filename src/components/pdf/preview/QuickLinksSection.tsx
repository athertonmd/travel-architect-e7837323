
import { PdfDesignFormValues } from "@/types/pdf";

interface QuickLinksSectionProps {
  settings: PdfDesignFormValues;
}

export function QuickLinksSection({ settings }: QuickLinksSectionProps) {
  return (
    <div style={{ marginTop: "30px" }}>
      <div style={{ backgroundColor: "#1a365d", color: "white", padding: "8px 15px", display: "flex", alignItems: "center" }}>
        <div style={{ fontWeight: "bold" }}>QUICK LINKS</div>
      </div>
      <div style={{ padding: "15px", display: "flex", flexWrap: "wrap", gap: "15px" }}>
        <a href="#" style={{ color: settings.primaryColor, textDecoration: "none", display: "flex", alignItems: "center", width: "calc(25% - 12px)", minWidth: "150px", marginBottom: "10px" }}>
          <span style={{ width: "24px", height: "24px", backgroundColor: settings.primaryColor, display: "inline-block", marginRight: "10px", borderRadius: "4px" }}></span>
          Company Portal
        </a>
        <a href="#" style={{ color: settings.primaryColor, textDecoration: "none", display: "flex", alignItems: "center", width: "calc(25% - 12px)", minWidth: "150px", marginBottom: "10px" }}>
          <span style={{ width: "24px", height: "24px", backgroundColor: settings.primaryColor, display: "inline-block", marginRight: "10px", borderRadius: "4px" }}></span>
          Weather
        </a>
        <a href="#" style={{ color: settings.primaryColor, textDecoration: "none", display: "flex", alignItems: "center", width: "calc(25% - 12px)", minWidth: "150px", marginBottom: "10px" }}>
          <span style={{ width: "24px", height: "24px", backgroundColor: settings.primaryColor, display: "inline-block", marginRight: "10px", borderRadius: "4px" }}></span>
          Visa & Passport
        </a>
        <a href="#" style={{ color: settings.primaryColor, textDecoration: "none", display: "flex", alignItems: "center", width: "calc(25% - 12px)", minWidth: "150px", marginBottom: "10px" }}>
          <span style={{ width: "24px", height: "24px", backgroundColor: settings.primaryColor, display: "inline-block", marginRight: "10px", borderRadius: "4px" }}></span>
          Currency Converter
        </a>
        <a href="#" style={{ color: settings.primaryColor, textDecoration: "none", display: "flex", alignItems: "center", width: "calc(25% - 12px)", minWidth: "150px", marginBottom: "10px" }}>
          <span style={{ width: "24px", height: "24px", backgroundColor: settings.primaryColor, display: "inline-block", marginRight: "10px", borderRadius: "4px" }}></span>
          World Clock
        </a>
      </div>
    </div>
  );
}
