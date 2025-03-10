
import { PdfDesignFormValues } from "@/types/pdf";

export function generatePreviewHtml(settings: PdfDesignFormValues, travelerNames: string[]): string {
  const displayTravelerNames = travelerNames.join(", ");
  
  const formatDate = (dateStr: string) => {
    if (settings.dateFormat === 'MM/DD/YYYY') {
      return '03/15/2024'; 
    } else if (settings.dateFormat === 'DD/MM/YYYY') {
      return '15/03/2024';
    } else {
      return '2024-03-15'; 
    }
  };
  
  return `
    <div style="font-family: ${settings.bodyFont}, sans-serif; color: #333; max-width: 100%; padding: 0; background-color: white;">
      <!-- Header Section -->
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
      
      <!-- Traveler Info Bar -->
      <div style="display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ccc; background-color: #f8f9fa; font-size: 12px;">
        <div>Travel arrangements for: ${displayTravelerNames}</div>
        <div>Agency reference: TRV-12345</div>
      </div>
      
      <!-- Trip Summary Header -->
      <div style="background-color: #1a365d; color: white; padding: 10px 15px; margin-top: 0; text-align: center;">
        <h2 style="margin: 0; font-family: ${settings.headerFont}, sans-serif;">Trip Summary</h2>
      </div>
      
      <!-- Travel Summary Section -->
      <div style="padding: 15px; border-bottom: 1px solid #ddd;">
        <div style="font-weight: bold; margin-bottom: 10px;">Travel summary</div>
        
        <!-- Flight Summary Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="width: 15%; text-align: left; padding: 8px 5px; color: #666;">From / To</th>
            <th style="width: 35%; text-align: left; padding: 8px 5px; color: #666;">Flight / Provider</th>
            <th style="width: 25%; text-align: left; padding: 8px 5px; color: #666;">Departure / Arrival</th>
            <th style="width: 25%; text-align: right; padding: 8px 5px; color: #666;"></th>
          </tr>
          
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 5px; vertical-align: top;">
              <div>${formatDate('2024-03-15')}</div>
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
              <div>${formatDate('2024-03-15')}</div>
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
              <div>${formatDate('2024-03-15')} - ${formatDate('2024-03-22')}</div>
              <div>HILTON SAN FRANCISCO</div>
            </td>
            <td style="padding: 8px 5px; vertical-align: top; color: #333;" colspan="3">
              <div>FINANCIAL DISTRICT</div>
            </td>
          </tr>
          
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 5px; vertical-align: top;">
              <div>${formatDate('2024-03-22')}</div>
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
              <div>${formatDate('2024-03-22')}</div>
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
      
      <!-- Detailed Flight Section -->
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
            <td style="width: 70%; padding: 8px 15px;">${formatDate('2024-03-15')} 10:50</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 15px; color: #666;">Arrival</td>
            <td style="padding: 8px 15px;">${formatDate('2024-03-15')} 13:45</td>
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
      
      <!-- Hotel Section -->
      <div style="margin-top: 30px;">
        <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
          <div style="font-weight: bold;">HILTON SAN FRANCISCO FINANCIAL DISTRICT</div>
        </div>
        <div style="padding: 5px 15px; font-size: 12px;">750 KEARNY ST, SAN FRANCISCO, CA, 94108, US</div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="width: 30%; padding: 8px 15px; color: #666;">Check in</td>
            <td style="width: 70%; padding: 8px 15px;">${formatDate('2024-03-15')}</td>
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
      
      <!-- Quick Links Section -->
      ${settings.includeQuickLinks !== false ? `
      <div style="margin-top: 30px;">
        <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
          <div style="font-weight: bold;">QUICK LINKS</div>
        </div>
        <div style="padding: 15px; display: flex; flex-wrap: wrap; gap: 15px;">
          <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
            <span style="width: 24px; height: 24px; backgroundColor: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
            Company Portal
          </a>
          <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
            <span style="width: 24px; height: 24px; backgroundColor: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
            Weather
          </a>
          <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
            <span style="width: 24px; height: 24px; backgroundColor: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
            Visa & Passport
          </a>
          <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
            <span style="width: 24px; height: 24px; backgroundColor: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
            Currency Converter
          </a>
          <a href="#" style="color: ${settings.primaryColor}; text-decoration: none; display: flex; align-items: center; width: calc(25% - 12px); min-width: 150px; margin-bottom: 10px;">
            <span style="width: 24px; height: 24px; backgroundColor: ${settings.primaryColor}; display: inline-block; margin-right: 10px; border-radius: 4px;"></span>
            World Clock
          </a>
        </div>
      </div>
      ` : ''}
      
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
}
