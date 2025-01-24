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
    const parsedSegments = typeof segments === 'string' ? JSON.parse(segments) : segments;
    
    if (!Array.isArray(parsedSegments)) {
      console.log('Segments is not an array, returning empty array');
      return [];
    }
    
    return parsedSegments.map(segment => ({
      id: segment.id || crypto.randomUUID(),
      type: segment.type || 'unknown',
      icon: segment.icon || '📍',
      details: segment.details && typeof segment.details === 'object' ? { ...segment.details } : {},
      position: {
        x: Number(segment?.position?.x) || 0,
        y: Number(segment?.position?.y) || 0
      }
    }));
  } catch (error) {
    console.error('Error sanitizing segments:', error);
    return [];
  }
};