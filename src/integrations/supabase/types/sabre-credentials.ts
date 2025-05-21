
export type SabreCredentialsRow = {
  id: string;
  user_id: string;
  pcc_p4uh: string | null;
  pcc_p4sh: string | null;
  queue_assignment: string | null;
  queue_number: string | null;
  fnbts_entry: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SabreCredentialsInsert = Omit<SabreCredentialsRow, 'id' | 'created_at' | 'updated_at'>;

export type SabreCredentialsUpdate = Partial<SabreCredentialsInsert>;
