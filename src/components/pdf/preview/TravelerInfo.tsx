
import { ReactNode } from "react";

interface TravelerInfoProps {
  travelerNames: string[];
  reference?: string;
}

export function TravelerInfo({ travelerNames, reference = "TRV-12345" }: TravelerInfoProps) {
  const displayTravelerNames = travelerNames.join(", ");
  
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 15px", borderBottom: "1px solid #ccc", backgroundColor: "#f8f9fa", fontSize: "12px" }}>
      <div>Travel arrangements for: {displayTravelerNames}</div>
      <div>Agency reference: {reference}</div>
    </div>
  );
}
