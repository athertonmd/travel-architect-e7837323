
// Format date or time value if it exists
export const formatDateTime = (value: string | null | undefined, isDate = true): string => {
  if (!value) return "";
  
  try {
    const date = new Date(value);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return value;
    
    if (isDate) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (e) {
    console.error(`Error formatting date/time: ${value}`, e);
    return value;
  }
};

// Sort segments chronologically based on dates
export const sortSegmentsByDate = (segments: any[]): any[] => {
  if (!Array.isArray(segments)) return [];
  
  const sortedSegments = [...segments];
  
  // Only apply chronological ordering to segments with dates
  // This ensures segments with dates appear in order, and segments without dates maintain their original position
  sortedSegments.sort((a, b) => {
    // Try to find any date field in the segment details
    const getEarliestDate = (segment: any) => {
      if (!segment?.details) return null;
      
      // Look for common date fields with priority
      const dateFields = [
        'date', 'start_date', 'startDate',
        'departureDate', 'checkInDate', 'pickupDate',
        'bookingDate', 'transferDate'
      ];
      
      for (const field of dateFields) {
        if (segment.details[field]) {
          return new Date(segment.details[field]).getTime();
        }
      }
      
      return null;
    };
    
    const aDate = getEarliestDate(a);
    const bDate = getEarliestDate(b);
    
    // If both have dates, compare them
    if (aDate && bDate) {
      return aDate - bDate;
    }
    
    // If only one has a date, prioritize the one with a date
    if (aDate) return -1;
    if (bDate) return 1;
    
    // If neither has a date, maintain original order
    return 0;
  });
  
  return sortedSegments;
};
