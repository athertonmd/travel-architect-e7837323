
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectorProps {
  hours: string;
  minutes: string;
  onHoursChange: (value: string) => void;
  onMinutesChange: (value: string) => void;
}

export function TimeSelector({ hours, minutes, onHoursChange, onMinutesChange }: TimeSelectorProps) {
  const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesArray = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label className="text-xs text-muted-foreground">Hours</Label>
        <Select value={hours} onValueChange={onHoursChange}>
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
        <Select value={minutes} onValueChange={onMinutesChange}>
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
  );
}
