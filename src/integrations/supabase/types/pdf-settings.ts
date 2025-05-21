
export type PdfSettingsRow = {
  id: string;
  user_id: string;
  show_page_numbers: boolean | null;
  include_notes: boolean | null;
  include_contact_info: boolean | null;
  created_at: string;
  updated_at: string;
  include_quick_links: boolean | null;
  quick_links: any | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  header_font: string | null;
  body_font: string | null;
  logo_url: string | null;
  date_format: string | null;
  time_format: string | null;
  company_name: string | null;
  header_text: string | null;
  footer_text: string | null;
  banner_image_url: string | null;
};

export type PdfSettingsInsert = Omit<PdfSettingsRow, 'id' | 'created_at' | 'updated_at'>;

export type PdfSettingsUpdate = Partial<PdfSettingsInsert>;
