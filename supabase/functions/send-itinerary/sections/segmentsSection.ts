
import { PdfSettings } from "../types/pdfTypes.ts";
import { drawSectionHeader, drawDetailRow } from "../utils/pdfUtils.ts";

// Define field mappings for different segment types
const segmentFieldMappings: Record<string, Record<string, string>> = {
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
const getFieldMapping = (segmentType: string): Record<string, string> => {
  // Normalize segment type to lowercase and handle aliases
  const normalizedType = segmentType.toLowerCase();
  
  // Handle common aliases
  if (normalizedType === "limo service") return segmentFieldMappings.limo;
  if (normalizedType === "vip service") return segmentFieldMappings.vip;
  
  // Return mapping or empty object if not found
  return segmentFieldMappings[normalizedType] || {};
};

// Format date or time value if it exists
const formatDateTime = (value: string | null | undefined, isDate = true): string => {
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

export const processSegments = (pdfDoc: any, page: any, trip: any, colors: any, yOffset: number, font: any, boldFont: any, settings?: PdfSettings) => {
  console.log("Processing trip segments...");
  let currentY = yOffset;
  let currentPage = page;
  
  if (!Array.isArray(trip.segments)) {
    console.log("No segments found or segments is not an array");
    return { currentY, currentPage };
  }
  
  // Debug: Log the structure of the first segment
  if (trip.segments.length > 0) {
    console.log("First segment structure:", JSON.stringify(trip.segments[0]).substring(0, 500));
  }
  
  // Sort segments by date if they have dates
  let sortedSegments = [...trip.segments];
  
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
  
  for (const segment of sortedSegments) {
    // Defensive programming - ensure the segment has a type
    if (!segment?.type) {
      console.log("Skipping segment without type property");
      continue;
    }
    
    // Skip notes if includeNotes is false
    if (segment.type.toLowerCase() === "notes" && settings?.includeNotes === false) {
      console.log("Skipping notes segment due to settings");
      continue;
    }

    // Check if we need a new page
    if (currentY < 100) {
      console.log("Adding new page...");
      currentPage = pdfDoc.addPage();
      currentY = currentPage.getSize().height - 50;
    }

    console.log("Adding segment:", segment.type);
    currentY = drawSectionHeader(currentPage, segment.type.toUpperCase(), currentY, boldFont, colors.primaryColor);

    if (segment.details && typeof segment.details === 'object') {
      // Get field mapping for this segment type
      const fieldMapping = getFieldMapping(segment.type);
      
      // Debug the segment details and field mapping
      console.log(`Segment details for ${segment.type}:`, Object.keys(segment.details));
      console.log(`Field mapping for ${segment.type}:`, fieldMapping);
      
      // Process known fields first (in the order defined in the mapping)
      if (Object.keys(fieldMapping).length > 0) {
        for (const [key, label] of Object.entries(fieldMapping)) {
          // Skip if value doesn't exist in details
          if (!(key in segment.details)) continue;
          
          const value = segment.details[key];
          
          // Skip null, undefined, empty strings and objects
          if (value === null || value === undefined || value === '' || typeof value === 'object') {
            continue;
          }
          
          // Skip contact info if includeContactInfo is false
          if (settings?.includeContactInfo === false && 
              (key.toLowerCase().includes('contact') || 
               key.toLowerCase().includes('phone') || 
               key.toLowerCase().includes('email'))) {
            continue;
          }
          
          // Format date fields
          let displayValue = String(value);
          if (key.toLowerCase().includes('date')) {
            displayValue = formatDateTime(displayValue, true);
          } else if (key.toLowerCase().includes('time')) {
            displayValue = formatDateTime(displayValue, false);
          }
          
          try {
            currentY = drawDetailRow(currentPage, label, displayValue, currentY, font, boldFont);
          } catch (err) {
            console.error(`Error drawing detail row for ${label}: ${err}`);
            // Continue with next detail instead of breaking the entire PDF generation
          }
        }
      } else {
        // Fallback to processing all fields if no mapping exists
        for (const [key, value] of Object.entries(segment.details)) {
          // Skip contact info if includeContactInfo is false
          if (settings?.includeContactInfo === false && 
              (key.toLowerCase().includes('contact') || 
               key.toLowerCase().includes('phone') || 
               key.toLowerCase().includes('email'))) {
            continue;
          }
          
          if (value && typeof value !== 'object') {
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            try {
              currentY = drawDetailRow(currentPage, label, String(value), currentY, font, boldFont);
            } catch (err) {
              console.error(`Error drawing detail row for ${label}: ${err}`);
              // Continue with next detail instead of breaking the entire PDF generation
            }
          } else if (value !== null && typeof value === 'object') {
            // Log complex objects but skip them in the PDF
            console.log(`Skipping complex object for ${key}:`, value);
          }
        }
      }
    } else {
      console.log(`No details or invalid details for segment ${segment.type}`);
    }

    currentY -= 20;
  }
  
  console.log("All segments processed successfully");
  return { currentY, currentPage };
};
