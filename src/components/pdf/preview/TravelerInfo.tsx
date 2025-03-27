
interface TravelerInfoProps {
  travelerNames: string[];
  reference?: string;
}

export function TravelerInfo({ travelerNames, reference = "TRV-12345" }: TravelerInfoProps): string {
  const displayTravelerNames = travelerNames.join(", ");
  
  return `
    <div style="display: flex; justify-content: space-between; padding: 8px 15px; border-bottom: 1px solid #ccc; background-color: #f8f9fa; font-size: 12px;">
      <div>Travel arrangements for: ${displayTravelerNames}</div>
      <div>Agency reference: ${reference}</div>
    </div>
  `;
}
