
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SegmentDetails } from "@/types/segment";
import { DateTimePicker } from "./hotel/DateTimePicker";
import { useState } from "react";

interface TrainSegmentFormProps {
  details: SegmentDetails;
  onDetailsChange: (details: SegmentDetails) => void;
}

export function TrainSegmentForm({ details, onDetailsChange }: TrainSegmentFormProps) {
  const [departureDate, setDepartureDate] = useState<Date | undefined>(() => {
    if (typeof details.departureDate === 'string') {
      return new Date(details.departureDate);
    }
    return undefined;
  });

  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(() => {
    if (typeof details.arrivalDate === 'string') {
      return new Date(details.arrivalDate);
    }
    return undefined;
  });

  const [departureHours, setDepartureHours] = useState<string>(
    details.departureTime?.split(':')?.[0] || "09"
  );
  const [departureMinutes, setDepartureMinutes] = useState<string>(
    details.departureTime?.split(':')?.[1] || "00"
  );
  const [arrivalHours, setArrivalHours] = useState<string>(
    details.arrivalTime?.split(':')?.[0] || "10"
  );
  const [arrivalMinutes, setArrivalMinutes] = useState<string>(
    details.arrivalTime?.split(':')?.[1] || "00"
  );

  const handleDepartureDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(departureHours), parseInt(departureMinutes));
      setDepartureDate(newDate);
      onDetailsChange({
        ...details,
        departureDate: newDate.toISOString(),
        departureTime: `${departureHours}:${departureMinutes}`,
      });
    }
  };

  const handleArrivalDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(arrivalHours), parseInt(arrivalMinutes));
      setArrivalDate(newDate);
      onDetailsChange({
        ...details,
        arrivalDate: newDate.toISOString(),
        arrivalTime: `${arrivalHours}:${arrivalMinutes}`,
      });
    }
  };

  const handleDepartureTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (type === 'hours') {
      setDepartureHours(value);
    } else {
      setDepartureMinutes(value);
    }
    if (departureDate) {
      const newDate = new Date(departureDate);
      newDate.setHours(
        type === 'hours' ? parseInt(value) : parseInt(departureHours),
        type === 'minutes' ? parseInt(value) : parseInt(departureMinutes)
      );
      onDetailsChange({
        ...details,
        departureDate: newDate.toISOString(),
        departureTime: `${type === 'hours' ? value : departureHours}:${
          type === 'minutes' ? value : departureMinutes
        }`,
      });
    }
  };

  const handleArrivalTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (type === 'hours') {
      setArrivalHours(value);
    } else {
      setArrivalMinutes(value);
    }
    if (arrivalDate) {
      const newDate = new Date(arrivalDate);
      newDate.setHours(
        type === 'hours' ? parseInt(value) : parseInt(arrivalHours),
        type === 'minutes' ? parseInt(value) : parseInt(arrivalMinutes)
      );
      onDetailsChange({
        ...details,
        arrivalDate: newDate.toISOString(),
        arrivalTime: `${type === 'hours' ? value : arrivalHours}:${
          type === 'minutes' ? value : arrivalMinutes
        }`,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onDetailsChange({
      ...details,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="departureStation" className="text-blue-500">
          Departure Station
        </Label>
        <Input
          id="departureStation"
          value={details.departureStation || ""}
          onChange={(e) => handleInputChange("departureStation", e.target.value)}
          placeholder="Enter departure station"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Departure Date and Time</Label>
        <DateTimePicker
          label="Departure"
          date={departureDate}
          hours={departureHours}
          minutes={departureMinutes}
          onDateSelect={handleDepartureDateSelect}
          onTimeChange={handleDepartureTimeChange}
          minDate={new Date()}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="trainOperator" className="text-blue-500">
          Train Operator
        </Label>
        <Input
          id="trainOperator"
          value={details.trainOperator || ""}
          onChange={(e) => handleInputChange("trainOperator", e.target.value)}
          placeholder="Enter train operator"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="destinationStation" className="text-blue-500">
          Destination Station
        </Label>
        <Input
          id="destinationStation"
          value={details.destinationStation || ""}
          onChange={(e) => handleInputChange("destinationStation", e.target.value)}
          placeholder="Enter destination station"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-blue-500">Arrival Date and Time</Label>
        <DateTimePicker
          label="Arrival"
          date={arrivalDate}
          hours={arrivalHours}
          minutes={arrivalMinutes}
          onDateSelect={handleArrivalDateSelect}
          onTimeChange={handleArrivalTimeChange}
          minDate={departureDate}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ticketReference" className="text-blue-500">
          Ticket Reference Number
        </Label>
        <Input
          id="ticketReference"
          value={details.ticketReference || ""}
          onChange={(e) => handleInputChange("ticketReference", e.target.value)}
          placeholder="Enter ticket reference number"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ticketClass" className="text-blue-500">
          Ticket Class
        </Label>
        <Input
          id="ticketClass"
          value={details.ticketClass || ""}
          onChange={(e) => handleInputChange("ticketClass", e.target.value)}
          placeholder="Enter ticket class"
        />
      </div>
    </div>
  );
}
