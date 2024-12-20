export type TravellersRow = {
  created_at: string
  email: string | null
  first_name: string
  id: string
  last_name: string
  mobile_number: string | null
  updated_at: string
  user_id: string
}

export type TravellersInsert = {
  created_at?: string
  email?: string | null
  first_name: string
  id?: string
  last_name: string
  mobile_number?: string | null
  updated_at?: string
  user_id: string
}

export type TravellersUpdate = {
  created_at?: string
  email?: string | null
  first_name?: string
  id?: string
  last_name?: string
  mobile_number?: string | null
  updated_at?: string
  user_id?: string
}