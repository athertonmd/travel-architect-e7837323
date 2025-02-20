
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

  useEffect(() => {
    // Log the current date state for debugging
    console.log('Current date state:', date);
    console.log('Current details:', details);
  }, [date, details]);

  const today = new Date();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const hours = time ? parseInt(time.split(':')[0]) : new Date().getHours();
      const minutes = time ? parseInt(time.split(':')[1]) : new Date().getMinutes();
      
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      
      console.log('Selected new date:', newDate);
      setDate(newDate);
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

  const formattedDate = date ? format(date, "MMMM d, yyyy") : "Pick a date";

  return (
    <div className="grid gap-2">
      <Label htmlFor="departureDate" className="text-blue-500">
        Departure Date and Time
      </Label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date-picker-button"
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-foreground">{formattedDate}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              defaultMonth={date}
              initialFocus
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
