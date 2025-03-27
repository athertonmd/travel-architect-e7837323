
export interface PdfSettings {
  id?: string;
  user_id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  header_font: string;
  body_font: string;
  logo_url: string | null;
  banner_image_url: string | null;
  show_page_numbers: boolean;
  include_notes: boolean;
  include_contact_info: boolean;
  include_quick_links: boolean;
  date_format: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  time_format: "12h" | "24h";
  company_name: string | null;
  header_text: string | null;
  footer_text: string | null;
  quick_links?: { name: string; url: string }[];
  created_at?: string;
  updated_at?: string;
}

export type PdfDesignFormValues = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerFont: string;
  bodyFont: string;
  logoUrl: string;
  bannerImageUrl: string;
  showPageNumbers: boolean;
  includeNotes: boolean;
  includeContactInfo: boolean;
  includeQuickLinks: boolean;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  companyName: string;
  headerText: string;
  footerText: string;
  sectionOrder?: string[];
  quickLinks?: { name: string; url: string }[];
}

export type PdfSection = {
  id: string;
  name: string;
  included: boolean;
};

export function mapDbSettingsToFormValues(settings: any): PdfDesignFormValues {
  return {
    primaryColor: settings.primary_color || "#1A1F2C",
    secondaryColor: settings.secondary_color || "#D6BCFA",
    accentColor: settings.accent_color || "#9b87f5",
    headerFont: settings.header_font || "Helvetica",
    bodyFont: settings.body_font || "Helvetica",
    logoUrl: settings.logo_url || "",
    bannerImageUrl: settings.banner_image_url || "",
    showPageNumbers: settings.show_page_numbers !== null ? settings.show_page_numbers : true,
    includeNotes: settings.include_notes !== null ? settings.include_notes : true,
    includeContactInfo: settings.include_contact_info !== null ? settings.include_contact_info : true,
    includeQuickLinks: settings.include_quick_links !== null ? settings.include_quick_links : true,
    dateFormat: (settings.date_format as "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD") || "MM/DD/YYYY",
    timeFormat: (settings.time_format as "12h" | "24h") || "12h",
    companyName: settings.company_name || "",
    headerText: settings.header_text || "",
    footerText: settings.footer_text || "",
    quickLinks: settings.quick_links || [
      { name: "Company Portal", url: "#" },
      { name: "Weather", url: "https://weather.com" },
      { name: "Visa & Passport", url: "https://travel.state.gov" },
      { name: "Currency Converter", url: "https://xe.com" },
      { name: "World Clock", url: "https://worldtimebuddy.com" },
    ]
  };
}

export function mapFormValuesToDbSettings(values: PdfDesignFormValues, userId: string): {
  user_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  header_font: string;
  body_font: string;
  logo_url: string | null;
  banner_image_url: string | null;
  show_page_numbers: boolean;
  include_notes: boolean;
  include_contact_info: boolean;
  include_quick_links: boolean;
  date_format: string;
  time_format: string;
  company_name: string | null;
  header_text: string | null;
  footer_text: string | null;
  quick_links?: { name: string; url: string }[];
} {
  return {
    user_id: userId,
    primary_color: values.primaryColor,
    secondary_color: values.secondaryColor,
    accent_color: values.accentColor,
    header_font: values.headerFont,
    body_font: values.bodyFont,
    logo_url: values.logoUrl || null,
    banner_image_url: values.bannerImageUrl || null,
    show_page_numbers: values.showPageNumbers,
    include_notes: values.includeNotes,
    include_contact_info: values.includeContactInfo,
    include_quick_links: values.includeQuickLinks,
    date_format: values.dateFormat,
    time_format: values.timeFormat,
    company_name: values.companyName || null,
    header_text: values.headerText || null,
    footer_text: values.footerText || null,
    quick_links: values.quickLinks
  };
}
