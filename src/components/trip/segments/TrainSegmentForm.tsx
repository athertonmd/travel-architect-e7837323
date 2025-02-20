
import { SegmentDetails } from "@/types/segment";
import { useState } from "react";
import { TrainDateTime } from "./train/TrainDateTime";
import { TrainStationInput } from "./train/TrainStationInput";
import { useTimeState } from "./train/useTimeState";

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

  const {
    hours: departureHours,
    minutes: departureMinutes,
    setHours: setDepartureHours,
    setMinutes: setDepartureMinutes
  } = useTimeState(details.departureTime as string | undefined, "09", "00");

  const {
    hours: arrivalHours,
    minutes: arrivalMinutes,
    setHours: setArrivalHours,
    setMinutes: setArrivalMinutes
  } = useTimeState(details.arrivalTime as string | undefined, "10", "00");

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

  const getStringValue = (value: unknown): string => {
    return typeof value === 'string' ? value : '';
  };

  return (
    <div className="space-y-4">
      <TrainStationInput
        id="departureStation"
        label="Departure Station"
        value={getStringValue(details.departureStation)}
        onChange={(value) => handleInputChange("departureStation", value)}
        placeholder="Enter departure station"
      />

      <TrainDateTime
        label="Departure Date and Time"
        date={departureDate}
        hours={departureHours}
        minutes={departureMinutes}
        onDateSelect={handleDepartureDateSelect}
        onTimeChange={handleDepartureTimeChange}
        minDate={new Date()}
      />

      <TrainStationInput
        id="trainOperator"
        label="Train Operator"
        value={getStringValue(details.trainOperator)}
        onChange={(value) => handleInputChange("trainOperator", value)}
        placeholder="Enter train operator"
      />

      <TrainStationInput
        id="destinationStation"
        label="Destination Station"
        value={getStringValue(details.destinationStation)}
        onChange={(value) => handleInputChange("destinationStation", value)}
        placeholder="Enter destination station"
      />

      <TrainDateTime
        label="Arrival Date and Time"
        date={arrivalDate}
        hours={arrivalHours}
        minutes={arrivalMinutes}
        onDateSelect={handleArrivalDateSelect}
        onTimeChange={handleArrivalTimeChange}
        minDate={departureDate}
      />

      <TrainStationInput
        id="ticketReference"
        label="Ticket Reference Number"
        value={getStringValue(details.ticketReference)}
        onChange={(value) => handleInputChange("ticketReference", value)}
        placeholder="Enter ticket reference number"
      />

      <TrainStationInput
        id="ticketClass"
        label="Ticket Class"
        value={getStringValue(details.ticketClass)}
        onChange={(value) => handleInputChange("ticketClass", value)}
        placeholder="Enter ticket class"
      />
    </div>
  );
}
