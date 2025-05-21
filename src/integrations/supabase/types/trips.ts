
export type TripsRow = {
  id: string;
  user_id: string;
  title: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  travelers: number | null;
  status: string | null;
  segments: any | null;
  created_at: string;
  updated_at: string;
  archived: boolean | null;
};

export type TripsInsert = Omit<TripsRow, 'id' | 'created_at' | 'updated_at'>;

export type TripsUpdate = Partial<TripsInsert>;
