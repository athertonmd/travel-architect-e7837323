
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { SegmentDetails } from "@/types/segment";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

  const today = new Date();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':');
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
      onDetailsChange("departureDate", selectedDate.toISOString());
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    if (date && e.target.value) {
      const [hours, minutes] = e.target.value.split(':');
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
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
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
