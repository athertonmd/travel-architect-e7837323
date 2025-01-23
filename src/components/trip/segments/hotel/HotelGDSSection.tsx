import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SegmentDetails } from "@/types/segment";
import { useState } from "react";
import { HotelBankDialog } from "./HotelBankDialog";
import { HotelsRow } from "@/integrations/supabase/types/hotels";

interface HotelGDSSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelGDSSection({ details, onDetailsChange }: HotelGDSSectionProps) {
  const [isHotelBankOpen, setIsHotelBankOpen] = useState(false);

  const handleGDSChange = (checked: boolean) => {
    onDetailsChange({ ...details, useGDS: checked });
  };

  const handleGDSCodeChange = (value: string) => {
    onDetailsChange({ ...details, gdsCode: value });
  };

  const handleHotelSelect = (hotel: HotelsRow) => {
    onDetailsChange({
      ...details,
      hotelName: hotel.name,
      addressLine1: hotel.address || "",
      stateProvince: hotel.city || "", // Map city to stateProvince
      country: hotel.country || "",
      telephone: hotel.telephone || "",
      website: hotel.website || "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="gds-toggle" className="text-blue-500">GDS</Label>
          <Switch
            id="gds-toggle"
            checked={details.useGDS as boolean || false}
            onCheckedChange={handleGDSChange}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsHotelBankOpen(true)}
          className="bg-navy hover:bg-navy/90 text-white"
          disabled={details.useGDS as boolean}
        >
          Hotel Bank
        </Button>
      </div>

      {details.useGDS && (
        <div className="grid gap-2">
          <Label htmlFor="gdsCode" className="text-blue-500">Record Locator</Label>
          <Input
            id="gdsCode"
            value={details.gdsCode as string || ""}
            onChange={(e) => handleGDSCodeChange(e.target.value)}
            placeholder="Enter Record Locator"
            className="text-gray-700"
          />
        </div>
      )}

      <HotelBankDialog
        open={isHotelBankOpen}
        onOpenChange={setIsHotelBankOpen}
        onHotelSelect={handleHotelSelect}
      />
    </div>
  );
}