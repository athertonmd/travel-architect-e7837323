
// Define field mappings for different segment types
export const segmentFieldMappings: Record<string, Record<string, string>> = {
  // Flight segment field mappings
  flight: {
    airline: "Airline",
    flightNumber: "Flight Number",
    departureAirport: "Departure Airport",
    destinationAirport: "Destination Airport",
    departureDate: "Departure Date",
    departureTime: "Departure Time",
    arrivalDate: "Arrival Date",
    arrivalTime: "Arrival Time",
    terminal: "Terminal",
    gate: "Gate",
    seatNumber: "Seat Number",
    cabinClass: "Cabin Class",
    confirmationNumber: "Confirmation Number",
    recordLocator: "Record Locator"
  },
  // Hotel segment field mappings
  hotel: {
    hotelName: "Hotel Name",
    checkInDate: "Check In",
    checkOutDate: "Check Out",
    roomType: "Room Type",
    addressLine1: "Address",
    city: "City",
    state: "State",
    zipCode: "Zip/Postal Code",
    country: "Country",
    confirmationNumber: "Confirmation Number",
    contactPhone: "Phone",
    contactEmail: "Email"
  },
  // Car segment field mappings
  car: {
    rentalCompany: "Rental Company",
    pickupDate: "Pick Up Date",
    pickupTime: "Pick Up Time",
    returnDate: "Return Date",
    returnTime: "Return Time",
    pickupLocation: "Pick Up Location",
    returnLocation: "Return Location",
    carType: "Car Type",
    confirmationNumber: "Confirmation Number"
  },
  // Train segment field mappings
  train: {
    trainOperator: "Train Operator",
    departureStation: "Departure Station",
    destinationStation: "Destination Station",
    departureDate: "Departure Date",
    departureTime: "Departure Time",
    arrivalDate: "Arrival Date",
    arrivalTime: "Arrival Time",
    ticketClass: "Ticket Class",
    ticketReference: "Ticket Reference"
  },
  // Limo segment field mappings
  limo: {
    provider: "Provider",
    location: "Location",
    pickupDate: "Pick Up Date",
    pickupTime: "Pick Up Time",
    dropoffDate: "Drop Off Date",
    dropoffTime: "Drop Off Time",
    driver: "Driver",
    confirmationNumber: "Confirmation Number"
  },
  // Restaurant segment field mappings
  restaurant: {
    restaurantName: "Restaurant Name",
    bookingDate: "Date",
    bookingTime: "Time",
    addressLine1: "Address",
    city: "City",
    state: "State",
    zipCode: "Zip/Postal Code",
    bookingReference: "Booking Reference"
  },
  // Activity segment field mappings
  activity: {
    activityName: "Activity Name",
    location: "Location",
    startDate: "Start Date",
    startTime: "Start Time",
    endDate: "End Date",
    endTime: "End Time",
    confirmationNumber: "Confirmation Number",
    notes: "Notes"
  },
  // Transfer segment field mappings
  transfer: {
    provider: "Provider",
    transferFrom: "From",
    transferTo: "To",
    transferDate: "Date",
    transferTime: "Time",
    pickupLocation: "Pick Up Location",
    confirmationNumber: "Confirmation Number"
  },
  // VIP service field mappings
  vip: {
    serviceProvider: "Service Provider",
    location: "Location",
    startDate: "Start Date",
    startTime: "Start Time",
    endDate: "End Date",
    endTime: "End Time",
    referenceNumber: "Reference Number",
    contactDetails: "Contact Details",
    comments: "Comments"
  }
};

// Function to get field mapping based on segment type
export const getFieldMapping = (segmentType: string): Record<string, string> => {
  // Normalize segment type to lowercase and handle aliases
  const normalizedType = segmentType.toLowerCase();
  
  // Handle common aliases
  if (normalizedType === "limo service") return segmentFieldMappings.limo;
  if (normalizedType === "vip service") return segmentFieldMappings.vip;
  
  // Return mapping or empty object if not found
  return segmentFieldMappings[normalizedType] || {};
};
