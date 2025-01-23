import { Database } from "../types";

export type HotelsRow = Database["public"]["Tables"]["hotels"]["Row"];
export type HotelsInsert = Database["public"]["Tables"]["hotels"]["Insert"];
export type HotelsUpdate = Database["public"]["Tables"]["hotels"]["Update"];