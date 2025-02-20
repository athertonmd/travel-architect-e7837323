
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "../hotel/DateTimePicker";

interface TrainDateTimeProps {
  label: string;
  date: Date | undefined;
  hours: string;
  minutes: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeChange: (type: 'hours' | 'minutes', value: string) => void;
  minDate?: Date;
}

export function TrainDateTime({
  label,
  date,
  hours,
  minutes,
  onDateSelect,
  onTimeChange,
  minDate
}: TrainDateTimeProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-blue-500">{label}</Label>
      <DateTimePicker
        label={label}
        date={date}
        hours={hours}
        minutes={minutes}
        onDateSelect={onDateSelect}
        onTimeChange={onTimeChange}
        minDate={minDate}
      />
    </div>
  );
}
