
export interface PdfSettings {
  id?: string;
  user_id?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  header_font: string;
  body_font: string;
  logo_url?: string;
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
  showPageNumbers: boolean;
  includeNotes: boolean;
  includeContactInfo: boolean;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  companyName?: string;
  headerText?: string;
  footerText?: string;
}

export function mapDbSettingsToFormValues(settings: PdfSettings): PdfDesignFormValues {
  return {
    primaryColor: settings.primary_color,
    secondaryColor: settings.secondary_color,
    accentColor: settings.accent_color,
    headerFont: settings.header_font,
    bodyFont: settings.body_font,
    logoUrl: settings.logo_url,
    showPageNumbers: settings.show_page_numbers,
    includeNotes: settings.include_notes,
    includeContactInfo: settings.include_contact_info,
    dateFormat: settings.date_format,
    timeFormat: settings.time_format,
    companyName: settings.company_name,
    headerText: settings.header_text,
    footerText: settings.footer_text
  };
}

export function mapFormValuesToDbSettings(values: PdfDesignFormValues, userId: string): Omit<PdfSettings, 'id' | 'created_at' | 'updated_at'> {
  return {
    user_id: userId,
    primary_color: values.primaryColor,
    secondary_color: values.secondaryColor,
    accent_color: values.accentColor,
    header_font: values.headerFont,
    body_font: values.bodyFont,
    logo_url: values.logoUrl,
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
