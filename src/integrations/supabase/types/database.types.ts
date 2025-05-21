
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          name: string
          location: string | null
          rating: string | null
          description: string | null
          address: string | null
          city: string | null
          country: string | null
          telephone: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          name: string
          location?: string | null
          rating?: string | null
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          telephone?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          name?: string
          location?: string | null
          rating?: string | null
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          telephone?: string | null
          website?: string | null
          zip_code?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}
