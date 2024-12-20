export { TravellersRow, TravellersInsert, TravellersUpdate } from './travellers';
export { ProfilesRow, ProfilesInsert, ProfilesUpdate } from './profiles';
export { TripsRow, TripsInsert, TripsUpdate } from './trips';

export type Database = {
  public: {
    Tables: {
      manage_travellers: {
        Row: TravellersRow;
        Insert: TravellersInsert;
        Update: TravellersUpdate;
      };
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
      };
      trips: {
        Row: TripsRow;
        Insert: TripsInsert;
        Update: TripsUpdate;
      };
    };
  };
};