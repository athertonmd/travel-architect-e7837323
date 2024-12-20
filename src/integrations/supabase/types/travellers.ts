export interface TravellersRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  mobile_number?: string;
  created_at: string;
  updated_at: string;
}

export interface TravellersInsert extends Omit<TravellersRow, 'id' | 'created_at' | 'updated_at'> {}
export interface TravellersUpdate extends Partial<TravellersInsert> {}