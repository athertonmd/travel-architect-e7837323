
import { PdfDesignFormValues } from "@/types/pdf";

interface HotelSectionProps {
  settings: PdfDesignFormValues;
  travelerNames: string[];
}

export function HotelSection({ settings, travelerNames }: HotelSectionProps): string {
  const displayTravelerNames = travelerNames.join(", ");
  
  const formatDate = (date: string) => {
    if (settings.dateFormat === 'MM/DD/YYYY') {
      return '03/15/2024';
    } else if (settings.dateFormat === 'DD/MM/YYYY') {
      return '15/03/2024';
    } else {
      return '2024-03-15';
    }
  };
  
  const checkoutDate = (date: string) => {
    if (settings.dateFormat === 'MM/DD/YYYY') {
      return '03/22/2024';
    } else if (settings.dateFormat === 'DD/MM/YYYY') {
      return '22/03/2024';
    } else {
      return '2024-03-22';
    }
  };
  
  return `
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
          <td style="padding: 8px 15px;">${checkoutDate('2024-03-22')}</td>
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
        ${settings.includeContactInfo ? `
        <tr style="border-bottom: 1px solid #eee;">
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
  `;
}
