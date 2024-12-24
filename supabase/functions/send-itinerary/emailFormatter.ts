export const formatItinerary = (segments: any[]) => {
  let html = '<div style="font-family: Arial, sans-serif;">';
  html += '<h2>Your Trip Itinerary</h2>';
  
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