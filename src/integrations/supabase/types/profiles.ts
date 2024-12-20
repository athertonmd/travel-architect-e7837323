export type ProfilesRow = {
  avatar_url: string | null;
  created_at: string;
  id: string;
  username: string | null;
}

export type ProfilesInsert = {
  avatar_url?: string | null;
  created_at?: string;
  id: string;
  username?: string | null;
}

export type ProfilesUpdate = {
  avatar_url?: string | null;
  created_at?: string;
  id?: string;
  username?: string | null;
}