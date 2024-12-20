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
}

export type TripsInsert = {
  user_id: string;
  title: string;
  destination?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  travelers?: number | null;
  status?: string | null;
  segments?: any | null;
}

export type TripsUpdate = {
  title?: string;
  destination?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  travelers?: number | null;
  status?: string | null;
  segments?: any | null;
}