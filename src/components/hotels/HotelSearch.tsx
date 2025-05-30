
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HotelSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const HotelSearch = ({ value, onChange }: HotelSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or location..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 text-white placeholder:text-gray-400 bg-navy/50"
      />
    </div>
  );
};
