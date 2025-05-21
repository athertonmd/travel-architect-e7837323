
export type HotelsRow = {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  location: string | null;
  rating: string | null;
  telephone: string | null;
  website: string | null;
  zip_code: string | null;
  created_at: string;
  updated_at: string;
};

export type HotelsInsert = Omit<HotelsRow, 'id' | 'created_at' | 'updated_at'>;

export type HotelsUpdate = Partial<HotelsInsert>;
