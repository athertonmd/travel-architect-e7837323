export type * from './travellers';

export type Database = {
  public: {
    Tables: {
      manage_travellers: {
        Row: TravellersRow;
        Insert: TravellersInsert;
        Update: TravellersUpdate;
      }
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
        Relationships: []
      }
      trips: {
        Row: TripsRow;
        Insert: TripsInsert;
        Update: TripsUpdate;
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
