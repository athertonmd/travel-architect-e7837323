
export interface HotelsRow {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  location?: string | null;
  rating?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  telephone?: string | null;
  website?: string | null;
  zip_code?: string | null;
}

export interface HotelsInsert Omit<HotelsRow, 'id' | 'created_at' | 'updated_at'>;
export interface HotelsUpdate Partial<HotelsInsert>;
