
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Predefined colors that match the site theme
const predefinedColors = [
  "#1A1F2C", // Navy (dark)
  "#9b87f5", // Purple
  "#7E69AB", // Secondary Purple
  "#D6BCFA", // Light Purple
  "#6E59A5", // Tertiary Purple
  "#8E9196", // Neutral Gray
  "#FFD700", // Gold
  "#FFFFFF", // White
];

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const [color, setColor] = useState(value);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded border border-gray-300" 
              style={{ backgroundColor: color }} 
            />
            <span className={color === "#FFFFFF" ? "text-black" : "text-white"}>
              {color}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                className="h-8 w-8 rounded-md border border-gray-300 cursor-pointer"
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorChange(presetColor)}
                type="button"
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={color}
              onChange={handleInputChange}
              className="w-10 h-10 p-1"
            />
            <Input
              type="text"
              value={color}
              onChange={handleInputChange}
              className="flex-1 text-white"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
