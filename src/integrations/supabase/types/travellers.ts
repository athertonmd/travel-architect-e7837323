export type TravellersRow = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  mobile_number: string | null;
  created_at: string;
  updated_at: string;
};

export type TravellersInsert = Omit<TravellersRow, 'id' | 'created_at' | 'updated_at'>;
export type TravellersUpdate = Partial<TravellersInsert>;