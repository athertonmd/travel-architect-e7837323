import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PdfDesignFormValues } from "@/types/pdf";
import { toast } from "sonner";

interface PdfPreviewProps {
  settings: PdfDesignFormValues;
}

export function PdfPreview({ settings }: PdfPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [travelerNames, setTravelerNames] = useState<string[]>(["John Smith"]); // Default value

  // Fetch traveler data if available - simulated for preview
  useEffect(() => {
    // In a real implementation, you would fetch this from your data source
    // This is just for demonstration in the preview
    const mockTravelerData = {
      traveller_names: ["Jane Doe", "Richard Roe"]
    };
    
    if (mockTravelerData.traveller_names && mockTravelerData.traveller_names.length > 0) {
      setTravelerNames(mockTravelerData.traveller_names);
    }
  }, []);

  useEffect(() => {
    // Format traveler names for display
    const displayTravelerNames = travelerNames.join(", ");
    
    // Generate a preview HTML based on current settings that resembles a professional travel itinerary
    const preview = `
      <div style="font-family: ${settings.bodyFont}, sans-serif; color: #333; max-width: 100%; padding: 0; background-color: white;">
        <!-- Header with banner image (if provided) or blue background -->
        ${settings.bannerImageUrl ? 
          `<div style="text-align: center; position: relative; width: 100%;">
            <img src="${settings.bannerImageUrl}" alt="Header Banner" style="width: 100%; max-height: 200px; object-fit: cover;" />
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%;">
              <div style="background-color: rgba(0,0,0,0.5); display: inline-block; padding: 8px 20px; border-radius: 4px;">
                <h2 style="margin: 5px 0; color: white; font-family: ${settings.headerFont}, sans-serif; text-shadow: 1px 1px 3px rgba(0,0,0,0.7);">${settings.companyName || 'Global Travel Company'}</h2>
                <div style="font-size: 14px; margin-top: 5px; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.7);">${settings.headerText || 'Corporate Travel Department'}</div>
              </div>
            </div>
          </div>` 
          : 
          `<div style="text-align: center; background-color: #1a365d; color: white; padding: 15px 0;">
            ${settings.logoUrl ? `<img src="${settings.logoUrl}" alt="Logo" style="max-height: 70px; margin-bottom: 10px;" />` : '<div style="width: 100px; height: 50px; background-color: #e2e8f0; margin: 0 auto;"></div>'}
            <h2 style="margin: 5px 0; color: white; font-family: ${settings.headerFont}, sans-serif;">${settings.companyName || 'Global Travel Company'}</h2>
            <div style="font-size: 14px; margin-top: 5px;">${settings.headerText || 'Corporate Travel Department'}</div>
          </div>`
        }
        
        <!-- Traveler info bar -->
        <div style="display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ccc; background-color: #f8f9fa; font-size: 12px;">
          <div>Travel arrangements for: ${displayTravelerNames}</div>
          <div>Agency reference: TRV-12345</div>
        </div>
        
        <!-- Trip Summary Header -->
        <div style="background-color: #1a365d; color: white; padding: 10px 15px; margin-top: 0; text-align: center;">
          <h2 style="margin: 0; font-family: ${settings.headerFont}, sans-serif;">Trip Summary</h2>
        </div>
        
        <!-- Travel summary section -->
        <div style="padding: 15px; border-bottom: 1px solid #ddd;">
          <div style="font-weight: bold; margin-bottom: 10px;">Travel summary</div>
          
          <!-- Flight summary table -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
            <tr style="border-bottom: 1px solid #ddd;">
              <th style="width: 15%; text-align: left; padding: 8px 5px; color: #666;">From / To</th>
              <th style="width: 35%; text-align: left; padding: 8px 5px; color: #666;">Flight / Provider</th>
              <th style="width: 25%; text-align: left; padding: 8px 5px; color: #666;">Departure / Arrival</th>
              <th style="width: 25%; text-align: right; padding: 8px 5px; color: #666;"></th>
            </tr>
            
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>${settings.dateFormat === 'MM/DD/YYYY' ? '03/15/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '15/03/2024' : '2024-03-15'}</div>
                <div>London (LHR) - New York (JFK)</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>British Airways BA175</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>10:50 - 13:45</div>
              </td>
              <td style="padding: 8px 5px; text-align: right; vertical-align: top;">
                <a href="#" style="color: ${settings.primaryColor}; text-decoration: none;">Check in</a>
              </td>
            </tr>
            
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>${settings.dateFormat === 'MM/DD/YYYY' ? '03/15/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '15/03/2024' : '2024-03-15'}</div>
                <div>New York (JFK) - San Francisco (SFO)</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>Delta Air Lines DL311</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>16:59 - 20:57</div>
              </td>
              <td style="padding: 8px 5px; text-align: right; vertical-align: top;">
                <a href="#" style="color: ${settings.primaryColor}; text-decoration: none;">Check in</a>
              </td>
            </tr>
            
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>${settings.dateFormat === 'MM/DD/YYYY' ? '03/15/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '15/03/2024' : '2024-03-15'} - ${settings.dateFormat === 'MM/DD/YYYY' ? '03/22/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '22/03/2024' : '2024-03-22'}</div>
                <div>HILTON SAN FRANCISCO</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top; color: #333;" colspan="3">
                <div>FINANCIAL DISTRICT</div>
              </td>
            </tr>
            
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>${settings.dateFormat === 'MM/DD/YYYY' ? '03/22/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '22/03/2024' : '2024-03-22'}</div>
                <div>San Francisco (SFO) - New York (JFK)</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>Delta Air Lines DL310</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>07:00 - 15:21</div>
              </td>
              <td style="padding: 8px 5px; text-align: right; vertical-align: top;">
                <a href="#" style="color: ${settings.primaryColor}; text-decoration: none;">Check in</a>
              </td>
            </tr>
            
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>${settings.dateFormat === 'MM/DD/YYYY' ? '03/22/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '22/03/2024' : '2024-03-22'}</div>
                <div>New York (JFK) - London (LHR)</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>British Airways BA112</div>
              </td>
              <td style="padding: 8px 5px; vertical-align: top;">
                <div>21:35 - 08:20 (+1)</div>
              </td>
              <td style="padding: 8px 5px; text-align: right; vertical-align: top;">
                <a href="#" style="color: ${settings.primaryColor}; text-decoration: none;">Check in</a>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Detailed flight section -->
        <div style="margin-top: 10px;">
          <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
            <div style="background-color: white; color: #1a365d; border-radius: 4px; padding: 2px 8px; margin-right: 10px; font-weight: bold; font-size: 12px;">BA 175</div>
            <div style="flex: 1; display: flex; justify-content: space-between;">
              <div>London<br><span style="font-size: 12px;">London Heathrow (LHR)</span></div>
              <div style="font-size: 20px; margin: 0 10px;">&rarr;</div>
              <div>New York City<br><span style="font-size: 12px;">New York John F Kennedy (JFK)</span></div>
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="width: 30%; padding: 8px 15px; color: #666;">Departure</td>
              <td style="width: 70%; padding: 8px 15px;">${settings.dateFormat === 'MM/DD/YYYY' ? '03/15/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '15/03/2024' : '2024-03-15'} 10:50</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Arrival</td>
              <td style="padding: 8px 15px;">${settings.dateFormat === 'MM/DD/YYYY' ? '03/15/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '15/03/2024' : '2024-03-15'} 13:45</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Departure terminal</td>
              <td style="padding: 8px 15px;">2</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Arrival terminal</td>
              <td style="padding: 8px 15px;">4</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Class</td>
              <td style="padding: 8px 15px;">Economy</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Meal</td>
              <td style="padding: 8px 15px;">Vegetarian Meal</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Duration</td>
              <td style="padding: 8px 15px;">06:55</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">eTicket</td>
              <td style="padding: 8px 15px;">0106784366395</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Seat</td>
              <td style="padding: 8px 15px;">33A (Window)</td>
            </tr>
            ${settings.includeNotes ? 
            `<tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Remarks</td>
              <td style="padding: 8px 15px;">VALID ID REQUIRED AT CHECKIN</td>
            </tr>` : ''}
          </table>
          
          <div style="padding: 10px 15px; display: flex; gap: 15px; font-size: 13px;">
            <div style="display: flex; align-items: center; color: ${settings.primaryColor};">
              <span style="margin-right: 5px;">✓</span> Check In
            </div>
            <div style="display: flex; align-items: center; color: ${settings.primaryColor};">
              <span style="margin-right: 5px;">☰</span> Baggage
            </div>
          </div>
        </div>
        
        <!-- Hotel section -->
        <div style="margin-top: 30px;">
          <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
            <div style="font-weight: bold;">HILTON SAN FRANCISCO FINANCIAL DISTRICT</div>
          </div>
          <div style="padding: 5px 15px; font-size: 12px;">750 KEARNY ST, SAN FRANCISCO, CA, 94108, US</div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="width: 30%; padding: 8px 15px; color: #666;">Check in</td>
              <td style="width: 70%; padding: 8px 15px;">${settings.dateFormat === 'MM/DD/YYYY' ? '03/15/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '15/03/2024' : '2024-03-15'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Check out</td>
              <td style="padding: 8px 15px;">${settings.dateFormat === 'MM/DD/YYYY' ? '03/22/2024' : settings.dateFormat === 'DD/MM/YYYY' ? '22/03/2024' : '2024-03-22'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Status</td>
              <td style="padding: 8px 15px;">Confirmed</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Duration</td>
              <td style="padding: 8px 15px;">7 nights</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Name</td>
              <td style="padding: 8px 15px;">${displayTravelerNames}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Room</td>
              <td style="padding: 8px 15px;">1 KING BED</td>
            </tr>
            ${settings.includeContactInfo ? 
            `<tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Telephone no.</td>
              <td style="padding: 8px 15px;">+1 415-433-6600</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Reference</td>
              <td style="padding: 8px 15px;">CDNFVARQ</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 15px; color: #666;">Special info.</td>
              <td style="padding: 8px 15px;">HIGH FLOOR</td>
            </tr>
          </table>
        </div>
        
        <!-- Quick Links Section - Now as a full-width segment -->
        <div style="margin-top: 30px;">
          <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
            <div style="font-weight: bold;">QUICK LINKS</div>
          </div>
          <div style="padding: 15px; display: flex; flex-wrap: wrap; gap: 15px;">
            <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
              <span style="width: 24px; height: 24px; background-color: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
              Company Portal
            </a>
            <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
              <span style="width: 24px; height: 24px; background-color: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
              Weather
            </a>
            <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
              <span style="width: 24px; height: 24px; background-color: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
              Visa & Passport
            </a>
            <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
              <span style="width: 24px; height: 24px; background-color: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
              Currency Converter
            </a>
            <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
              <span style="width: 24px; height: 24px; background-color: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
              World Clock
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        ${settings.footerText ? 
        `<div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666; padding: 15px; border-top: 1px solid #eee;">
          ${settings.footerText}
        </div>` : ''}
        
        ${settings.showPageNumbers ? 
        `<div style="text-align: right; font-size: 10px; color: #999; padding: 10px 15px;">
          Page 1 of 3
        </div>` : ''}
      </div>
    `;
    
    setPreviewHtml(preview);
  }, [settings, travelerNames]);

  const handleDownloadClick = async () => {
    try {
      console.log("Generating sample PDF...");
      
      // Create a simple PDF document using the browser's print functionality
      // Create a new window with the preview HTML
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Pop-up was blocked. Please allow pop-ups to download the sample PDF.");
        return;
      }
      
      // Write the preview HTML to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Trip Itinerary Sample</title>
            <style>
              body { font-family: ${settings.bodyFont || 'Arial'}, sans-serif; }
              h1, h2, h3 { font-family: ${settings.headerFont || 'Arial'}, sans-serif; }
              a { color: ${settings.primaryColor}; }
            </style>
          </head>
          <body>
            ${previewHtml}
            <script>
              // Auto print once loaded
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      
      toast.success("Sample PDF prepared for download");
    } catch (error) {
      console.error("Error generating sample PDF:", error);
      toast.error("Failed to generate sample PDF");
    }
  };

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h4 className="font-medium text-gray-900">PDF Preview</h4>
        <Button size="sm" variant="outline" className="gap-1" onClick={handleDownloadClick}>
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
