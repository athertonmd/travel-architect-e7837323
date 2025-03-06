
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Fonts that are likely to be available in most PDF generators
const availableFonts = [
  "Helvetica",
  "Times",
  "Courier",
  "Arial",
  "Verdana",
  "Georgia",
  "Garamond",
  "Tahoma",
  "Trebuchet MS"
];

export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>
      <SelectContent>
        {availableFonts.map(font => (
          <SelectItem key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
