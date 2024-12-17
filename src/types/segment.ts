export interface SegmentDetails {
  time?: string;
  location?: string;
  notes?: string;
}

export interface SegmentNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  details: SegmentDetails;
  onSelect?: (id: string) => void;
}

export interface SegmentData {
  type: string;
  details: SegmentDetails;
  position: {
    x: number;
    y: number;
  };
}