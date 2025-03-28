export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hotels: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          rating: string | null
          telephone: string | null
          updated_at: string
          user_id: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          rating?: string | null
          telephone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          rating?: string | null
          telephone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manage_travellers: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          mobile_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          mobile_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          mobile_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manage_travellers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_settings: {
        Row: {
          accent_color: string | null
          banner_image_url: string | null
          body_font: string | null
          company_name: string | null
          created_at: string
          date_format: string | null
          footer_text: string | null
          header_font: string | null
          header_text: string | null
          id: string
          include_contact_info: boolean | null
          include_notes: boolean | null
          include_quick_links: boolean | null
          logo_url: string | null
          primary_color: string | null
          quick_links: Json | null
          secondary_color: string | null
          show_page_numbers: boolean | null
          time_format: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accent_color?: string | null
          banner_image_url?: string | null
          body_font?: string | null
          company_name?: string | null
          created_at?: string
          date_format?: string | null
          footer_text?: string | null
          header_font?: string | null
          header_text?: string | null
          id?: string
          include_contact_info?: boolean | null
          include_notes?: boolean | null
          include_quick_links?: boolean | null
          logo_url?: string | null
          primary_color?: string | null
          quick_links?: Json | null
          secondary_color?: string | null
          show_page_numbers?: boolean | null
          time_format?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accent_color?: string | null
          banner_image_url?: string | null
          body_font?: string | null
          company_name?: string | null
          created_at?: string
          date_format?: string | null
          footer_text?: string | null
          header_font?: string | null
          header_text?: string | null
          id?: string
          include_contact_info?: boolean | null
          include_notes?: boolean | null
          include_quick_links?: boolean | null
          logo_url?: string | null
          primary_color?: string | null
          quick_links?: Json | null
          secondary_color?: string | null
          show_page_numbers?: boolean | null
          time_format?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      sabre_credentials: {
        Row: {
          additional_notes: string | null
          created_at: string
          fnbts_entry: string | null
          id: string
          pcc_p4sh: string | null
          pcc_p4uh: string | null
          queue_assignment: string | null
          queue_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          fnbts_entry?: string | null
          id?: string
          pcc_p4sh?: string | null
          pcc_p4uh?: string | null
          queue_assignment?: string | null
          queue_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          fnbts_entry?: string | null
          id?: string
          pcc_p4sh?: string | null
          pcc_p4uh?: string | null
          queue_assignment?: string | null
          queue_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sent_notifications: {
        Row: {
          id: string
          recipients: Json
          sent_at: string
          sent_by: string
          trip_id: string
        }
        Insert: {
          id?: string
          recipients: Json
          sent_at?: string
          sent_by: string
          trip_id: string
        }
        Update: {
          id?: string
          recipients?: Json
          sent_at?: string
          sent_by?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sent_notifications_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      travelport_credentials: {
        Row: {
          additional_notes: string | null
          branch_id: string | null
          created_at: string
          id: string
          pcc: string | null
          profile_name: string | null
          queue_number: string | null
          signatory: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          pcc?: string | null
          profile_name?: string | null
          queue_number?: string | null
          signatory?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          pcc?: string | null
          profile_name?: string | null
          queue_number?: string | null
          signatory?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          archived: boolean | null
          created_at: string
          destination: string | null
          end_date: string | null
          id: string
          segments: Json | null
          start_date: string | null
          status: string | null
          title: string
          travelers: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          created_at?: string
          destination?: string | null
          end_date?: string | null
          id?: string
          segments?: Json | null
          start_date?: string | null
          status?: string | null
          title: string
          travelers?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          created_at?: string
          destination?: string | null
          end_date?: string | null
          id?: string
          segments?: Json | null
          start_date?: string | null
          status?: string | null
          title?: string
          travelers?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_pdf_settings_for_user: {
        Args: {
          user_id_param: string
        }
        Returns: Json
      }
      is_farquhar: {
        Args: {
          userid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
