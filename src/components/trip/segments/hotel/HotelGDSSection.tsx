import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SegmentDetails } from "@/types/segment";

interface HotelGDSSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelGDSSection({ details, onDetailsChange }: HotelGDSSectionProps) {
  const handleChange = (field: keyof SegmentDetails, value: string | boolean) => {
    onDetailsChange({ ...details, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="gds-mode" className="text-blue-500">GDS</Label>
          <Switch
            id="gds-mode"
            checked={details.gdsEnabled as boolean}
            onCheckedChange={(checked) => handleChange("gdsEnabled", checked)}
          />
        </div>
        <Button
          variant="outline"
          className="bg-navy hover:bg-navy-light text-white border-navy"
          disabled={details.gdsEnabled as boolean}
          onClick={(e) => {
            e.preventDefault();
            console.log('Opening hotel bank');
          }}
        >
          Hotel Bank
        </Button>
      </div>

      {details.gdsEnabled && (
        <div className="grid gap-2 mb-4">
          <Label htmlFor="recordLocator" className="text-blue-500">Find Record Locator</Label>
          <Input
            id="recordLocator"
            value={details.recordLocator as string || ""}
            onChange={(e) => handleChange("recordLocator", e.target.value)}
            placeholder="Enter record locator"
          />
        </div>
      )}
    </div>
  );
}