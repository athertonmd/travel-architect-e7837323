import { CalendarDays, Users } from "lucide-react";

interface TripMetadataProps {
  startDate: string;
  endDate: string;
  travelers: number;
}

export function TripMetadata({ startDate, endDate, travelers }: TripMetadataProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
        <span className="text-sm">
          {startDate} - {endDate}
        </span>
      </div>
      <div className="flex items-center">
        <Users className="h-4 w-4 mr-1 text-gray-500" />
        <span className="text-sm">{travelers} travelers</span>
      </div>
    </div>
  );
}