
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TrainStationInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function TrainStationInput({ id, label, value, onChange, placeholder }: TrainStationInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-blue-500">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
