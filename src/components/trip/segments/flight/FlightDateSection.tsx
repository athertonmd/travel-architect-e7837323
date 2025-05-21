
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parse } from "date-fns";
import { SegmentDetails } from "@/types/segment";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [hours, setHours] = useState<string>(
    details.departureDate ? format(new Date(details.departureDate), "HH") : "00"
  );
  const [minutes, setMinutes] = useState<string>(
    details.departureDate ? format(new Date(details.departureDate), "mm") : "00"
  );

  useEffect(() => {
    if (details.departureDate) {
      const newDate = new Date(details.departureDate);
      setDate(newDate);
      setHours(format(newDate, "HH"));
      setMinutes(format(newDate, "mm"));
    }
  }, [details.departureDate]);

  useEffect(() => {
    console.log('Current date state:', date);
    console.log('Current details:', details);
  }, [date, details]);

  const today = new Date();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      
      console.log('Selected new date:', newDate);
      setDate(newDate);
      onDetailsChange("departureDate", newDate.toISOString());
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (type === 'hours') {
      setHours(value);
    } else {
      setMinutes(value);
    }

    if (date) {
      const newDate = new Date(date);
      newDate.setHours(
        type === 'hours' ? parseInt(value) : parseInt(hours),
        type === 'minutes' ? parseInt(value) : parseInt(minutes)
      );
      onDetailsChange("departureDate", newDate.toISOString());
    }
  };

  const formattedDate = date ? format(date, "MMMM d, yyyy") : "Pick a date";
  const formattedTime = `${hours}:${minutes}`;

  // Generate hours and minutes arrays for the selectors
  const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

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
                "w-[240px] justify-start text-left font-normal bg-white",
                !date && "text-muted-foreground"
              )}
            >
              <div className="flex items-center w-full">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="flex-grow text-foreground">{formattedDate}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
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
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[120px] justify-start text-left font-normal bg-white",
                !date && "text-muted-foreground"
              )}
            >
              <div className="flex items-center w-full">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span className="flex-grow text-foreground">{formattedTime}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 bg-white" align="start">
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Hours</Label>
                <Select value={hours} onValueChange={(value) => handleTimeChange('hours', value)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent className="h-[200px] bg-white">
                    {hoursArray.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Minutes</Label>
                <Select value={minutes} onValueChange={(value) => handleTimeChange('minutes', value)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent className="h-[200px] bg-white">
                    {minutesArray.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
