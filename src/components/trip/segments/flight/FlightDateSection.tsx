
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { SegmentDetails } from "@/types/segment";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FlightDateSectionProps {
  details: SegmentDetails;
  onDetailsChange: (field: keyof SegmentDetails, value: string | boolean) => void;
}

export function FlightDateSection({ details, onDetailsChange }: FlightDateSectionProps) {
  const [date, setDate] = useState<Date | undefined>(
    details.departureDate ? new Date(details.departureDate) : undefined
  );
  const [time, setTime] = useState<string>(
    details.departureDate ? format(new Date(details.departureDate), "HH:mm") : ""
  );

  useEffect(() => {
    if (details.departureDate) {
      const newDate = new Date(details.departureDate);
      setDate(newDate);
      setTime(format(newDate, "HH:mm"));
    }
  }, [details.departureDate]);

  const today = new Date();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      // Preserve existing time if any, or default to current time
      const hours = time ? parseInt(time.split(':')[0]) : new Date().getHours();
      const minutes = time ? parseInt(time.split(':')[1]) : new Date().getMinutes();
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onDetailsChange("departureDate", newDate.toISOString());
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date && newTime) {
      const [hours, minutes] = newTime.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onDetailsChange("departureDate", newDate.toISOString());
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="departureDate" className="text-blue-500">
        Departure Date and Time
      </Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-gray-600"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMMM d, yyyy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < today}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="w-[150px] text-gray-700"
        />
      </div>
    </div>
  );
}
