export type ProfilesRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export type ProfilesInsert = {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
}

export type ProfilesUpdate = {
  username?: string | null;
  avatar_url?: string | null;
}