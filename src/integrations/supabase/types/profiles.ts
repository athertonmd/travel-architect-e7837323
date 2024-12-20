export type ProfilesRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type ProfilesInsert = Omit<ProfilesRow, 'created_at'>;

export type ProfilesUpdate = Partial<ProfilesInsert>;