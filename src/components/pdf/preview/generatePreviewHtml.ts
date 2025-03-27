
import { PdfDesignFormValues } from "@/types/pdf";
import { QuickLink } from "../PdfPreview";
import { HeaderSection } from "./HeaderSection";
import { TravelerInfo } from "./TravelerInfo";
import { TripSummarySection } from "./TripSummarySection";
import { FlightDetailsSection } from "./FlightDetailsSection";
import { HotelSection } from "./HotelSection";
import { QuickLinksSection } from "./QuickLinksSection";
import { FooterSection } from "./FooterSection";

export function generatePreviewHtml(settings: PdfDesignFormValues, travelerNames: string[], quickLinks: QuickLink[] = []): string {
  return `
    <div style="font-family: ${settings.bodyFont}, sans-serif; color: #333; max-width: 100%; padding: 0; background-color: white;">
      <!-- Header Section -->
      ${HeaderSection({ settings })}
      
      <!-- Traveler Info Bar -->
      ${TravelerInfo({ travelerNames })}
      
      <!-- Trip Summary Header -->
      <div style="background-color: #1a365d; color: white; padding: 10px 15px; margin-top: 0; text-align: center;">
        <h2 style="margin: 0; font-family: ${settings.headerFont}, sans-serif;">Trip Summary</h2>
      </div>
      
      <!-- Travel Summary Section -->
      ${TripSummarySection({ settings })}
      
      <!-- Detailed Flight Section -->
      ${FlightDetailsSection({ settings })}
      
      <!-- Hotel Section -->
      ${HotelSection({ settings, travelerNames })}
      
      <!-- Quick Links Section -->
      ${settings.includeQuickLinks !== false ? QuickLinksSection({ settings, quickLinks }) : ''}
      
      <!-- Footer -->
      ${FooterSection({ settings })}
    </div>
  `;
}
