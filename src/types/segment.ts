export interface SegmentDetails {
  location?: string;
  time?: string;
  date?: string;
  notes?: string;
  airline?: string;
  flightNumber?: string;
  terminal?: string;
  gate?: string;
  seatNumber?: string;
}

export interface SegmentNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  details?: SegmentDetails;
  onSelect?: (id: string) => void;
}