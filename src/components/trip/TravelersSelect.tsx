import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelersSelectProps {
  onChange: (value: number) => void;
}

export const TravelersSelect = ({ onChange }: TravelersSelectProps) => {
  return (
    <div className="w-32">
      <Select defaultValue="1" onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Select travelers" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? 'Traveler' : 'Travelers'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};