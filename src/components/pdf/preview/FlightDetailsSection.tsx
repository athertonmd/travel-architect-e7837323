
import { PdfDesignFormValues } from "@/types/pdf";

interface FlightDetailsSectionProps {
  settings: PdfDesignFormValues;
}

export function FlightDetailsSection({ settings }: FlightDetailsSectionProps): string {
  const formatDate = (date: string) => {
    if (settings.dateFormat === 'MM/DD/YYYY') {
      return '03/15/2024';
    } else if (settings.dateFormat === 'DD/MM/YYYY') {
      return '15/03/2024';
    } else {
      return '2024-03-15';
    }
  };
  
  return `
    <div style="margin-top: 10px;">
      <div style="background-color: #1a365d; color: white; padding: 8px 15px; display: flex; align-items: center;">
        <div style="background-color: white; color: #1a365d; border-radius: 4px; padding: 2px 8px; margin-right: 10px; font-weight: bold; font-size: 12px;">BA 175</div>
        <div style="flex: 1; display: flex; justify-content: space-between;">
          <div>London<br/><span style="font-size: 12px;">London Heathrow (LHR)</span></div>
          <div style="font-size: 20px; margin: 0 10px;">&rarr;</div>
          <div>New York City<br/><span style="font-size: 12px;">New York John F Kennedy (JFK)</span></div>
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
        ${settings.includeNotes ? `
        <tr style="border-bottom: 1px solid #eee;">
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
  `;
}
