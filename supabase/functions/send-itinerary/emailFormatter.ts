export const formatItinerary = (trip: any) => {
  let html = '<div style="font-family: Arial, sans-serif;">';
  
  // Add header image
  html += `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://fakwoguybbzfpwokzhvj.supabase.co/storage/v1/object/public/lovable-uploads/eea4357d-4c1b-4221-9da7-35dd2344a1f8.png" 
           alt="Far East Travel Specialists" 
           style="max-width: 100%; height: auto;"
      />
    </div>
  `;
  
  html += `<h2>Your Trip Itinerary: ${trip.title}</h2>`;
  
  const segments = typeof trip.segments === 'string' 
    ? JSON.parse(trip.segments) 
    : trip.segments;

  segments.forEach((segment: any) => {
    html += formatSegment(segment);
  });
  
  html += '</div>';
  return html;
};

const formatSegment = (segment: any) => {
  let html = `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
      <h3 style="margin: 0 0 10px 0;">${segment.type.charAt(0).toUpperCase() + segment.type.slice(1)}</h3>
  `;

  if (segment.details) {
    const details = segment.details;
    
    // Common details
    if (details.date) html += `<p><strong>Date:</strong> ${details.date}</p>`;
    if (details.time) html += `<p><strong>Time:</strong> ${details.time}</p>`;
    
    // Specific details based on segment type
    html += formatSegmentDetails(segment.type, details);
  }
  
  html += '</div>';
  return html;
};

const formatSegmentDetails = (type: string, details: any) => {
  let html = '';
  
  switch (type) {
    case 'flight':
      if (details.departureAirport) html += `<p><strong>From:</strong> ${details.departureAirport}</p>`;
      if (details.destinationAirport) html += `<p><strong>To:</strong> ${details.destinationAirport}</p>`;
      if (details.flightNumber) html += `<p><strong>Flight:</strong> ${details.flightNumber}</p>`;
      break;
    
    case 'hotel':
      if (details.hotelName) html += `<p><strong>Hotel:</strong> ${details.hotelName}</p>`;
      if (details.addressLine1) html += `<p><strong>Address:</strong> ${details.addressLine1}</p>`;
      if (details.checkInDate) html += `<p><strong>Check-in:</strong> ${details.checkInDate}</p>`;
      if (details.checkOutDate) html += `<p><strong>Check-out:</strong> ${details.checkOutDate}</p>`;
      break;
    
    case 'car':
    case 'limo':
      if (details.provider) html += `<p><strong>Provider:</strong> ${details.provider}</p>`;
      if (details.pickupDate) html += `<p><strong>Pickup:</strong> ${details.pickupDate}</p>`;
      if (details.dropoffDate) html += `<p><strong>Drop-off:</strong> ${details.dropoffDate}</p>`;
      break;
  }
  
  return html;
};