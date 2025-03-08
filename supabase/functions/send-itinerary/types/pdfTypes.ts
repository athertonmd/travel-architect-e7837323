
export interface PdfSettings {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headerFont?: string;
  bodyFont?: string;
  logoUrl?: string;
  bannerImageUrl?: string;
  showPageNumbers?: boolean;
  includeNotes?: boolean;
  includeContactInfo?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  companyName?: string;
  headerText?: string;
  footerText?: string;
}

export interface TripData {
  title: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  segments?: any[];
  [key: string]: any;
}
