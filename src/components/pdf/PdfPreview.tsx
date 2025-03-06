
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PdfDesignFormValues } from "./PdfDesignForm";

interface PdfPreviewProps {
  settings: PdfDesignFormValues;
}

export function PdfPreview({ settings }: PdfPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("");

  useEffect(() => {
    // Generate a preview HTML based on current settings
    const preview = `
      <div style="font-family: ${settings.bodyFont}, sans-serif; color: #333; max-width: 100%; padding: 20px; background-color: white;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid ${settings.primaryColor};">
          ${settings.logoUrl ? `<img src="${settings.logoUrl}" alt="Logo" style="max-height: 60px; margin-bottom: 10px;" />` : ''}
          <h1 style="color: ${settings.primaryColor}; font-family: ${settings.headerFont}, sans-serif; margin: 0;">${settings.companyName || 'Company Name'}</h1>
          <p style="color: ${settings.secondaryColor};">${settings.headerText || 'Your Travel Itinerary'}</p>
        </div>
        
        <!-- Trip Details -->
        <div style="margin-bottom: 30px;">
          <h2 style="color: ${settings.primaryColor}; font-family: ${settings.headerFont}, sans-serif;">Trip to Paris</h2>
          <p><strong>Date:</strong> ${settings.dateFormat === 'MM/DD/YYYY' ? '06/15/2023' : settings.dateFormat === 'DD/MM/YYYY' ? '15/06/2023' : '2023-06-15'} - ${settings.dateFormat === 'MM/DD/YYYY' ? '06/22/2023' : settings.dateFormat === 'DD/MM/YYYY' ? '22/06/2023' : '2023-06-22'}</p>
          <p><strong>Travelers:</strong> John Doe, Jane Doe</p>
        </div>
        
        <!-- Flight Section -->
        <div style="margin-bottom: 30px; padding: 15px; background-color: ${settings.accentColor}10; border-left: 4px solid ${settings.accentColor};">
          <h3 style="color: ${settings.primaryColor}; font-family: ${settings.headerFont}, sans-serif;">Flight Details</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div>
              <p><strong>Departure:</strong> ${settings.timeFormat === '12h' ? '10:30 AM' : '10:30'} on ${settings.dateFormat === 'MM/DD/YYYY' ? '06/15/2023' : settings.dateFormat === 'DD/MM/YYYY' ? '15/06/2023' : '2023-06-15'}</p>
              <p><strong>From:</strong> New York (JFK)</p>
            </div>
            <div>
              <p><strong>Arrival:</strong> ${settings.timeFormat === '12h' ? '10:45 PM' : '22:45'} on ${settings.dateFormat === 'MM/DD/YYYY' ? '06/15/2023' : settings.dateFormat === 'DD/MM/YYYY' ? '15/06/2023' : '2023-06-15'}</p>
              <p><strong>To:</strong> Paris (CDG)</p>
            </div>
          </div>
          <p><strong>Airline:</strong> Air France</p>
          <p><strong>Flight Number:</strong> AF123</p>
          ${settings.includeNotes ? '<p><strong>Notes:</strong> Please arrive at the airport 3 hours before departure</p>' : ''}
          ${settings.includeContactInfo ? '<p><strong>Airline Contact:</strong> +1-800-123-4567</p>' : ''}
        </div>
        
        <!-- Hotel Section -->
        <div style="margin-bottom: 30px; padding: 15px; background-color: ${settings.accentColor}10; border-left: 4px solid ${settings.accentColor};">
          <h3 style="color: ${settings.primaryColor}; font-family: ${settings.headerFont}, sans-serif;">Hotel Reservation</h3>
          <p><strong>Hotel:</strong> Grand Hotel Paris</p>
          <p><strong>Check-in:</strong> ${settings.dateFormat === 'MM/DD/YYYY' ? '06/15/2023' : settings.dateFormat === 'DD/MM/YYYY' ? '15/06/2023' : '2023-06-15'} at ${settings.timeFormat === '12h' ? '3:00 PM' : '15:00'}</p>
          <p><strong>Check-out:</strong> ${settings.dateFormat === 'MM/DD/YYYY' ? '06/22/2023' : settings.dateFormat === 'DD/MM/YYYY' ? '22/06/2023' : '2023-06-22'} at ${settings.timeFormat === '12h' ? '12:00 PM' : '12:00'}</p>
          <p><strong>Confirmation Number:</strong> HB123456</p>
          ${settings.includeContactInfo ? '<p><strong>Hotel Contact:</strong> +33-1-23-45-67-89</p>' : ''}
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p style="text-align: center;">${settings.footerText || 'Thank you for choosing our travel services'}</p>
          ${settings.showPageNumbers ? '<p style="text-align: right;">Page 1 of 3</p>' : ''}
        </div>
      </div>
    `;
    
    setPreviewHtml(preview);
  }, [settings]);

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h4 className="font-medium text-gray-900">PDF Preview</h4>
        <Button size="sm" variant="outline" className="gap-1">
          <Download className="h-4 w-4" />
          Download Sample
        </Button>
      </div>
      <div className="p-0 h-[600px] overflow-auto">
        <iframe
          srcDoc={previewHtml}
          title="PDF Preview"
          className="w-full h-full border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
