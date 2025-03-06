import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
export function SabreInformationAlert() {
  return <Alert className="mb-6 bg-navy-light border-gold/20">
      <Info className="h-4 w-4 text-gold" />
      <AlertTitle className="text-gold">How we use this information</AlertTitle>
      <AlertDescription className="text-white/90">Trip Builder uses these Sabre credentials to access PNR data via Sabre Queue Placement (QP). This allows us to automatically retrieve and process your booking information.</AlertDescription>
    </Alert>;
}