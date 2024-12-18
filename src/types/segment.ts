export interface SegmentDetails extends Record<string, unknown> {
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

export interface SegmentNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  details?: SegmentDetails;
}

export type SegmentData = {
  type: string;
  details: SegmentDetails;
  position: {
    x: number;
    y: number;
  };
}

export type TripSegments = SegmentData[];

export type SupabaseSegment = {
  type: string;
  details: SegmentDetails;
  position: {
    x: number;
    y: number;
  };
}

// Helper type for Supabase JSON compatibility
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

export type SupabaseJsonSegment = {
  type: string;
  details: { [key: string]: JsonValue };
  position: {
    x: number;
    y: number;
  };
}