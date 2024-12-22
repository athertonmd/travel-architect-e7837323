import { CalendarDays, Users } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";

interface TripMetadataProps {
  startDate: string;
  endDate: string;
  travelers: number;
  earliestDate?: string;
}

export function TripMetadata({ startDate, endDate, travelers, earliestDate }: TripMetadataProps) {
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'No date set';
      
      // Try to parse the date string
      const date = parseISO(dateString);
      
      // Check if the parsed date is valid
      if (!isValid(date)) {
        console.log('Invalid date:', dateString);
        return 'Invalid date';
      }
      
      return format(date, 'EEEE, d MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
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