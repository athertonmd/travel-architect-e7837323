export interface SegmentDetails {
  location?: string;
  time?: string;
  notes?: string;
  airline?: string;
  flightNumber?: string;
  terminal?: string;
  gate?: string;
  seatNumber?: string;
  departureDate?: string;
  returnDate?: string;
  isOneWay?: boolean;
  departureAirport?: string;
  destinationAirport?: string;
  cabinClass?: string;
}

export interface SegmentNodeData {
  label: string;
  icon: string;
  details?: SegmentDetails;
}

export interface SegmentData {
  type: string;
  details: SegmentDetails;
  position: {
    x: number;
    y: number;
  };
}

export type TripSegments = SegmentData[];

export interface SupabaseSegment {
  type: string;
  details: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
}