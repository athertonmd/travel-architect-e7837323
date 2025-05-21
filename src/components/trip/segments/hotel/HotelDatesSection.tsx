
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { DateTimePicker } from "./DateTimePicker";
import { parseISO, format, isValid } from "date-fns";

interface HotelDatesSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelDatesSection({ details, onDetailsChange }: HotelDatesSectionProps) {
  const handleDateTimeChange = (field: keyof SegmentDetails, value: Date | undefined) => {
    const formattedDate = value && isValid(value) ? value.toISOString() : undefined;
    onDetailsChange({ ...details, [field]: formattedDate });
  };

  const parseDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const date = parseISO(dateString);
      return isValid(date) ? date : undefined;
    } catch {
      return undefined;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label className="text-blue-500">Check-in Date and Time</Label>
        <DateTimePicker
          date={parseDate(details.checkInDate as string)}
          setDate={(date) => handleDateTimeChange("checkInDate", date)}
          time={details.checkInTime as string}
          setTime={(time) => onDetailsChange({ ...details, checkInTime: time })}
        />
      </div>

      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label className="text-blue-500">Check-out Date and Time</Label>
        <DateTimePicker
          date={parseDate(details.checkOutDate as string)}
          setDate={(date) => handleDateTimeChange("checkOutDate", date)}
          time={details.checkOutTime as string}
          setTime={(time) => onDetailsChange({ ...details, checkOutTime: time })}
        />
      </div>
    </div>
  );
}
