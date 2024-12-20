export interface ProfilesRow {
  id: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

export interface ProfilesInsert extends Omit<ProfilesRow, 'created_at'> {}
export interface ProfilesUpdate extends Partial<ProfilesInsert> {}