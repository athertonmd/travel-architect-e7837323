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

export type TravellersInsert = {
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  mobile_number?: string | null;
};

export type TravellersUpdate = {
  first_name?: string;
  last_name?: string;
  email?: string | null;
  mobile_number?: string | null;
};