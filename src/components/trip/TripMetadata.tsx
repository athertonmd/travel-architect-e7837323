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
      if (!dateString) return '';
      
      // Try to parse the date string
      const date = parseISO(dateString);
      
      // Check if the parsed date is valid
      if (!isValid(date)) {
        console.log('Invalid date:', dateString);
        return '';
      }
      
      return format(date, 'EEEE, d MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formattedStartDate = formatDate(earliestDate || startDate);
  const formattedEndDate = formatDate(endDate);

  return (
    <div className="flex items-center gap-4">
      {(formattedStartDate || formattedEndDate) && (
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm">
            {formattedStartDate} {formattedEndDate && formattedStartDate && '-'} {formattedEndDate}
          </span>
        </div>
      )}
      <div className="flex items-center">
        <Users className="h-4 w-4 mr-1 text-gray-500" />
        <span className="text-sm">
          {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
        </span>
      </div>
    </div>
  );
}