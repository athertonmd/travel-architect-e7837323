export interface PdfSettings {
  id?: string;
  user_id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  header_font: string;
  body_font: string;
  logo_url?: string;
  banner_image_url?: string;
  show_page_numbers: boolean;
  include_notes: boolean;
  include_contact_info: boolean;
  date_format: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  time_format: "12h" | "24h";
  company_name?: string;
  header_text?: string;
  footer_text?: string;
  created_at?: string;
  updated_at?: string;
}

export type PdfDesignFormValues = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerFont: string;
  bodyFont: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  showPageNumbers: boolean;
  includeNotes: boolean;
  includeContactInfo: boolean;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  companyName?: string;
  headerText?: string;
  footerText?: string;
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
    logoUrl: settings.logo_url,
    bannerImageUrl: settings.banner_image_url,
    showPageNumbers: settings.show_page_numbers !== null ? settings.show_page_numbers : true,
    includeNotes: settings.include_notes !== null ? settings.include_notes : true,
    includeContactInfo: settings.include_contact_info !== null ? settings.include_contact_info : true,
    dateFormat: (settings.date_format as "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD") || "MM/DD/YYYY",
    timeFormat: (settings.time_format as "12h" | "24h") || "12h",
    companyName: settings.company_name,
    headerText: settings.header_text,
    footerText: settings.footer_text
  };
}

export function mapFormValuesToDbSettings(values: PdfDesignFormValues, userId: string): {
  user_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  header_font: string;
  body_font: string;
  logo_url?: string;
  banner_image_url?: string;
  show_page_numbers: boolean;
  include_notes: boolean;
  include_contact_info: boolean;
  date_format: string;
  time_format: string;
  company_name?: string;
  header_text?: string;
  footer_text?: string;
} {
  return {
    user_id: userId,
    primary_color: values.primaryColor,
    secondary_color: values.secondaryColor,
    accent_color: values.accentColor,
    header_font: values.headerFont,
    body_font: values.bodyFont,
    logo_url: values.logoUrl,
    banner_image_url: values.bannerImageUrl,
    show_page_numbers: values.showPageNumbers,
    include_notes: values.includeNotes,
    include_contact_info: values.includeContactInfo,
    date_format: values.dateFormat,
    time_format: values.timeFormat,
    company_name: values.companyName,
    header_text: values.headerText,
    footer_text: values.footerText
  };
}
