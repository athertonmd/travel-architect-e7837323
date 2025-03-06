
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function TravelportInformationAlert() {
  return (
    <Alert className="mb-6 bg-navy-light border-purple-500/20">
      <Info className="h-4 w-4 text-purple-500" />
      <AlertTitle className="text-purple-500">How we use this information</AlertTitle>
      <AlertDescription className="text-white/90">
        Trip Builder uses these Travelport credentials to access PNR data via the Travelport system. 
        This allows us to automatically retrieve and process your booking information.
      </AlertDescription>
    </Alert>
  );
}
