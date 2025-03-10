
import { PdfDesignFormValues } from "@/types/pdf";

interface HeaderSectionProps {
  settings: PdfDesignFormValues;
}

export function HeaderSection({ settings }: HeaderSectionProps) {
  if (settings.bannerImageUrl) {
    return (
      <div style={{ textAlign: "center", position: "relative", width: "100%" }}>
        <img src={settings.bannerImageUrl} alt="Header Banner" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "100%" }}>
          <div style={{ backgroundColor: "rgba(0,0,0,0.5)", display: "inline-block", padding: "8px 20px", borderRadius: "4px" }}>
            <h2 style={{ margin: "5px 0", color: "white", fontFamily: `${settings.headerFont}, sans-serif`, textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
              {settings.companyName || 'Global Travel Company'}
            </h2>
            <div style={{ fontSize: "14px", marginTop: "5px", color: "white", textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
              {settings.headerText || 'Corporate Travel Department'}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ textAlign: "center", backgroundColor: "#1a365d", color: "white", padding: "15px 0" }}>
      {settings.logoUrl ? 
        <img src={settings.logoUrl} alt="Logo" style={{ maxHeight: "70px", marginBottom: "10px" }} /> : 
        <div style={{ width: "100px", height: "50px", backgroundColor: "#e2e8f0", margin: "0 auto" }}></div>
      }
      <h2 style={{ margin: "5px 0", color: "white", fontFamily: `${settings.headerFont}, sans-serif` }}>
        {settings.companyName || 'Global Travel Company'}
      </h2>
      <div style={{ fontSize: "14px", marginTop: "5px" }}>
        {settings.headerText || 'Corporate Travel Department'}
      </div>
    </div>
  );
}
