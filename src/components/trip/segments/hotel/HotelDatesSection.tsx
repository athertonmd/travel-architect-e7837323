
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { useState } from "react";
import { DateTimePicker } from "./DateTimePicker";

interface HotelDatesSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelDatesSection({ details, onDetailsChange }: HotelDatesSectionProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(() => {
    if (typeof details.checkInDate === 'string') {
      return new Date(details.checkInDate);
    }
    return undefined;
  });

  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(() => {
    if (typeof details.checkOutDate === 'string') {
      return new Date(details.checkOutDate);
    }
    return undefined;
  });

  const [checkInHours, setCheckInHours] = useState<string>("14");
  const [checkInMinutes, setCheckInMinutes] = useState<string>("00");
  const [checkOutHours, setCheckOutHours] = useState<string>("12");
  const [checkOutMinutes, setCheckOutMinutes] = useState<string>("00");

  const today = new Date();

  const handleCheckInDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(checkInHours), parseInt(checkInMinutes));
      setCheckInDate(newDate);
      onDetailsChange({ 
        ...details, 
        checkInDate: newDate.toISOString(),
        checkInTime: `${checkInHours}:${checkInMinutes}`
      });
    }
  };

  const handleCheckOutDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(checkOutHours), parseInt(checkOutMinutes));
      setCheckOutDate(newDate);
      onDetailsChange({ 
        ...details, 
        checkOutDate: newDate.toISOString(),
        checkOutTime: `${checkOutHours}:${checkOutMinutes}`
      });
    }
  };

  const handleCheckInTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (type === 'hours') {
      setCheckInHours(value);
    } else {
      setCheckInMinutes(value);
    }
    if (checkInDate) {
      const newDate = new Date(checkInDate);
      newDate.setHours(
        type === 'hours' ? parseInt(value) : parseInt(checkInHours),
        type === 'minutes' ? parseInt(value) : parseInt(checkInMinutes)
      );
      onDetailsChange({ 
        ...details, 
        checkInDate: newDate.toISOString(),
        checkInTime: `${type === 'hours' ? value : checkInHours}:${type === 'minutes' ? value : checkInMinutes}`
      });
    }
  };

  const handleCheckOutTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (type === 'hours') {
      setCheckOutHours(value);
    } else {
      setCheckOutMinutes(value);
    }
    if (checkOutDate) {
      const newDate = new Date(checkOutDate);
      newDate.setHours(
        type === 'hours' ? parseInt(value) : parseInt(checkOutHours),
        type === 'minutes' ? parseInt(value) : parseInt(checkOutMinutes)
      );
      onDetailsChange({ 
        ...details, 
        checkOutDate: newDate.toISOString(),
        checkOutTime: `${type === 'hours' ? value : checkOutHours}:${type === 'minutes' ? value : checkOutMinutes}`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="checkInDate" className="text-blue-500">Check-in Date and Time</Label>
        <DateTimePicker
          label="Check-in"
          date={checkInDate}
          hours={checkInHours}
          minutes={checkInMinutes}
          onDateSelect={handleCheckInDateSelect}
          onTimeChange={handleCheckInTimeChange}
          minDate={today}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkOutDate" className="text-blue-500">Check-out Date and Time</Label>
        <DateTimePicker
          label="Check-out"
          date={checkOutDate}
          hours={checkOutHours}
          minutes={checkOutMinutes}
          onDateSelect={handleCheckOutDateSelect}
          onTimeChange={handleCheckOutTimeChange}
          minDate={checkInDate || today}
        />
      </div>
    </div>
  );
}
