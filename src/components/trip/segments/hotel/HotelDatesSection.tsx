
import { Label } from "@/components/ui/label";
import { SegmentDetails } from "@/types/segment";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface HotelDatesSectionProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function HotelDatesSection({ details, onDetailsChange }: HotelDatesSectionProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    details.checkInDate ? new Date(details.checkInDate) : undefined
  );
  const [checkInHours, setCheckInHours] = useState<string>("14");
  const [checkInMinutes, setCheckInMinutes] = useState<string>("00");
  
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    details.checkOutDate ? new Date(details.checkOutDate) : undefined
  );
  const [checkOutHours, setCheckOutHours] = useState<string>("12");
  const [checkOutMinutes, setCheckOutMinutes] = useState<string>("00");

  const today = new Date();

  // Generate hours and minutes arrays for the selectors
  const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleDateSelect = (type: 'checkIn' | 'checkOut', selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (type === 'checkIn') {
        newDate.setHours(parseInt(checkInHours), parseInt(checkInMinutes));
        setCheckInDate(newDate);
        onDetailsChange({ 
          ...details, 
          checkInDate: newDate.toISOString(),
          checkInTime: `${checkInHours}:${checkInMinutes}`
        });
      } else {
        newDate.setHours(parseInt(checkOutHours), parseInt(checkOutMinutes));
        setCheckOutDate(newDate);
        onDetailsChange({ 
          ...details, 
          checkOutDate: newDate.toISOString(),
          checkOutTime: `${checkOutHours}:${checkOutMinutes}`
        });
      }
    }
  };

  const handleTimeChange = (type: 'checkIn' | 'checkOut', timeType: 'hours' | 'minutes', value: string) => {
    if (type === 'checkIn') {
      if (timeType === 'hours') {
        setCheckInHours(value);
      } else {
        setCheckInMinutes(value);
      }
      if (checkInDate) {
        const newDate = new Date(checkInDate);
        newDate.setHours(
          timeType === 'hours' ? parseInt(value) : parseInt(checkInHours),
          timeType === 'minutes' ? parseInt(value) : parseInt(checkInMinutes)
        );
        onDetailsChange({ 
          ...details, 
          checkInDate: newDate.toISOString(),
          checkInTime: `${timeType === 'hours' ? value : checkInHours}:${timeType === 'minutes' ? value : checkInMinutes}`
        });
      }
    } else {
      if (timeType === 'hours') {
        setCheckOutHours(value);
      } else {
        setCheckOutMinutes(value);
      }
      if (checkOutDate) {
        const newDate = new Date(checkOutDate);
        newDate.setHours(
          timeType === 'hours' ? parseInt(value) : parseInt(checkOutHours),
          timeType === 'minutes' ? parseInt(value) : parseInt(checkOutMinutes)
        );
        onDetailsChange({ 
          ...details, 
          checkOutDate: newDate.toISOString(),
          checkOutTime: `${timeType === 'hours' ? value : checkOutHours}:${timeType === 'minutes' ? value : checkOutMinutes}`
        });
      }
    }
  };

  const formattedCheckInDate = checkInDate ? format(checkInDate, "MMMM d, yyyy") : "Pick a date";
  const formattedCheckInTime = `${checkInHours}:${checkInMinutes}`;
  const formattedCheckOutDate = checkOutDate ? format(checkOutDate, "MMMM d, yyyy") : "Pick a date";
  const formattedCheckOutTime = `${checkOutHours}:${checkOutMinutes}`;

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="checkInDate" className="text-blue-500">Check-in Date and Time</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <div className="flex items-center w-full">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="flex-grow text-foreground">{formattedCheckInDate}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={(date) => handleDateSelect('checkIn', date)}
                disabled={(date) => date < today}
                defaultMonth={checkInDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[120px] justify-start text-left font-normal",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <div className="flex items-center w-full">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="flex-grow text-foreground">{formattedCheckInTime}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Hours</Label>
                  <Select value={checkInHours} onValueChange={(value) => handleTimeChange('checkIn', 'hours', value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
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
                  <Select value={checkInMinutes} onValueChange={(value) => handleTimeChange('checkIn', 'minutes', value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
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

      <div className="grid gap-2">
        <Label htmlFor="checkOutDate" className="text-blue-500">Check-out Date and Time</Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <div className="flex items-center w-full">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="flex-grow text-foreground">{formattedCheckOutDate}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={(date) => handleDateSelect('checkOut', date)}
                disabled={(date) => date < (checkInDate || today)}
                defaultMonth={checkOutDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[120px] justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <div className="flex items-center w-full">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="flex-grow text-foreground">{formattedCheckOutTime}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs text-muted-foreground">Hours</Label>
                  <Select value={checkOutHours} onValueChange={(value) => handleTimeChange('checkOut', 'hours', value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
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
                  <Select value={checkOutMinutes} onValueChange={(value) => handleTimeChange('checkOut', 'minutes', value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
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
    </div>
  );
}
