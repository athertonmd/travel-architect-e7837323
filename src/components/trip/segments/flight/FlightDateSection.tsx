
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { SegmentDetails } from "@/types/segment";

interface FlightDateSectionProps {
  details: SegmentDetails;
  onDetailsChange: (field: keyof SegmentDetails, value: string | boolean) => void;
}

export function FlightDateSection({ details, onDetailsChange }: FlightDateSectionProps) {
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    details.departureDate ? new Date(details.departureDate as string) : undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    details.returnDate ? new Date(details.returnDate as string) : undefined
  );

  const handleDateChange = (field: "departureDate" | "returnDate", date: Date | undefined) => {
    if (field === "departureDate") {
      setDepartureDate(date);
      onDetailsChange(
        field,
        date ? format(date, "yyyy-MM-dd") : ""
      );
    } else {
      setReturnDate(date);
      onDetailsChange(
        field,
        date ? format(date, "yyyy-MM-dd") : ""
      );
    }
  };

  const handleTimeChange = (field: "departureTime" | "returnTime", value: string) => {
    onDetailsChange(field, value);
  };

  const handleOneWayChange = (checked: boolean) => {
    onDetailsChange("isOneWay", checked);
    if (checked) {
      setReturnDate(undefined);
      onDetailsChange("returnDate", "");
      onDetailsChange("returnTime", "");
    }
  };

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "PP") : "Pick a date";
  };

  return (
    <div className="space-y-4 bg-white rounded-md p-3 border border-gray-200 shadow-sm mb-4">
      <div className="flex items-center space-x-2 mb-4">
        <Label htmlFor="one-way" className="font-medium text-blue-500">
          One way
        </Label>
        <Switch
          id="one-way"
          checked={details.isOneWay as boolean}
          onCheckedChange={handleOneWayChange}
        />
      </div>

      <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
        <Label htmlFor="departureDate" className="text-blue-500">
          Departure Date & Time
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="departureDate"
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-white border-gray-200",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(departureDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={(date) => handleDateChange("departureDate", date)}
                initialFocus
                className="bg-white pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center border rounded-md border-gray-200 bg-white px-3">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              type="time"
              value={details.departureTime as string || ""}
              onChange={(e) => handleTimeChange("departureTime", e.target.value)}
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-white"
            />
          </div>
        </div>
      </div>

      {!details.isOneWay && (
        <div className="grid gap-2 bg-white rounded-md p-3 border border-gray-200 shadow-sm">
          <Label htmlFor="returnDate" className="text-blue-500">
            Return Date & Time
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="returnDate"
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-white border-gray-200",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDate(returnDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => handleDateChange("returnDate", date)}
                  initialFocus
                  className="bg-white pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center border rounded-md border-gray-200 bg-white px-3">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                type="time"
                value={details.returnTime as string || ""}
                onChange={(e) => handleTimeChange("returnTime", e.target.value)}
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
