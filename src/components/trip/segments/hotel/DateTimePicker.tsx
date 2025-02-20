
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimeSelector } from "./TimeSelector";

interface DateTimePickerProps {
  label: string;
  date: Date | undefined;
  hours: string;
  minutes: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeChange: (type: 'hours' | 'minutes', value: string) => void;
  minDate?: Date;
}

export function DateTimePicker({
  label,
  date,
  hours,
  minutes,
  onDateSelect,
  onTimeChange,
  minDate
}: DateTimePickerProps) {
  const formattedDate = date ? format(date, "MMMM d, yyyy") : "Pick a date";
  const formattedTime = `${hours}:${minutes}`;

  return (
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
            <div className="flex items-center w-full">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              <span className="flex-grow text-foreground">{formattedDate}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            disabled={(date) => minDate ? date < minDate : false}
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
              "w-[120px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center w-full">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span className="flex-grow text-foreground">{formattedTime}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <TimeSelector
            hours={hours}
            minutes={minutes}
            onHoursChange={(value) => onTimeChange('hours', value)}
            onMinutesChange={(value) => onTimeChange('minutes', value)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
