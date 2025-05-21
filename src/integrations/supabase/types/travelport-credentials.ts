
export type TravelportCredentialsRow = {
  id: string;
  user_id: string;
  pcc: string | null;
  profile_name: string | null;
  branch_id: string | null;
  queue_number: string | null;
  signatory: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TravelportCredentialsInsert = Omit<TravelportCredentialsRow, 'id' | 'created_at' | 'updated_at'>;

export type TravelportCredentialsUpdate = Partial<TravelportCredentialsInsert>;
