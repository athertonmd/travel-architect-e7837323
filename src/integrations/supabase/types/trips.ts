export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TripsRow = {
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

export type TripsInsert = {
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

export type TripsUpdate = {
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