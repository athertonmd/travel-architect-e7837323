export interface TripsRow {
  id: string;
  user_id: string;
  title: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  travelers?: number;
  status?: string;
  segments?: any;
  created_at: string;
  updated_at: string;
}

export interface TripsInsert extends Omit<TripsRow, 'id' | 'created_at' | 'updated_at'> {}
export interface TripsUpdate extends Partial<TripsInsert> {}