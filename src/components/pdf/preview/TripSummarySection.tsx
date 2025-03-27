
import { PdfDesignFormValues } from "@/types/pdf";

interface TripSummarySectionProps {
  settings: PdfDesignFormValues;
}

export function TripSummarySection({ settings }: TripSummarySectionProps): string {
  const formatDate = (date: string) => {
    // Format the date based on user settings
    if (settings.dateFormat === 'MM/DD/YYYY') {
      return '03/15/2024';  // example for March 15th
    } else if (settings.dateFormat === 'DD/MM/YYYY') {
      return '15/03/2024';
    } else {
      return '2024-03-15';
    }
  };
  
  return `
    <div style="padding: 15px; border-bottom: 1px solid #ddd;">
      <div style="font-weight: bold; margin-bottom: 10px;">Travel summary</div>
      
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
  `;
}
