export interface SegmentDetails {
  time?: string;
  location?: string;
  notes?: string;
}

export interface SegmentNodeData {
  label: string;
  icon: string;
  details: SegmentDetails;
  onSelect?: (id: string) => void;
}

export interface SegmentData {
  type: string;
  details: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
}