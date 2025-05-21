
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimeSelector } from "./TimeSelector";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string | undefined;
  setTime: (time: string) => void;
}

export function DateTimePicker({
  date,
  setDate,
  time,
  setTime
}: DateTimePickerProps) {
  const formattedDate = date ? format(date, "MMMM d, yyyy") : "Pick a date";
  const formattedTime = time || "00:00";

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
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
            onSelect={setDate}
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
              !time && "text-muted-foreground"
            )}
          >
            <div className="flex items-center w-full">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span className="flex-grow text-foreground">{formattedTime}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white" align="start">
          <TimeSelector
            hours={formattedTime.split(":")[0] || "00"}
            minutes={formattedTime.split(":")[1] || "00"}
            onHoursChange={(hours) => setTime(`${hours}:${formattedTime.split(":")[1] || "00"}`)}
            onMinutesChange={(minutes) => setTime(`${formattedTime.split(":")[0] || "00"}:${minutes}`)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
