export const sanitizeTripData = (trip: any) => {
  return {
    title: String(trip.title || ''),
    destination: String(trip.destination || ''),
    start_date: trip.start_date ? String(trip.start_date) : null,
    end_date: trip.end_date ? String(trip.end_date) : null,
    travelers: Number(trip.travelers) || 0,
    segments: sanitizeSegments(trip.segments)
  };
};

export const sanitizeSegments = (segments: any) => {
  try {
    if (!Array.isArray(segments)) {
      console.log('Segments is not an array, returning empty array');
      return [];
    }
    
    return segments.map(segment => ({
      type: String(segment.type || 'unknown'),
      details: segment.details && typeof segment.details === 'object' 
        ? Object.fromEntries(
            Object.entries(segment.details)
              .filter(([_, value]) => value !== null && value !== undefined)
              .map(([key, value]) => [key, String(value)])
          )
        : {}
    }));
  } catch (error) {
    console.error('Error sanitizing segments:', error);
    return [];
  }
};