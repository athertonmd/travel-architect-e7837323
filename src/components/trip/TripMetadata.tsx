import { CalendarDays, Users } from "lucide-react";
import { format } from "date-fns";

interface TripMetadataProps {
  startDate: string;
  endDate: string;
  travelers: number;
  earliestDate?: string;
}

export function TripMetadata({ startDate, endDate, travelers, earliestDate }: TripMetadataProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'EEEE, d MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
        <span className="text-sm">
          {formatDate(earliestDate || startDate)} - {formatDate(endDate)}
        </span>
      </div>
      <div className="flex items-center">
        <Users className="h-4 w-4 mr-1 text-gray-500" />
        <span className="text-sm">
          {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
        </span>
      </div>
    </div>
  );
}