
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define TravellersRow interface based on the database schema
interface TravellersRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  mobile_number?: string | null;
  created_at: string;
  updated_at: string;
}

export const useTravellerSearch = () => {
  const [travellers, setTravellers] = useState<TravellersRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTravellers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setTravellers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await supabase
        .from("manage_travellers")
        .select("*")
        .or(
          `first_name.ilike.%${query}%,` +
          `last_name.ilike.%${query}%,` +
          `email.ilike.%${query}%`
        )
        .limit(5);

      if (searchError) throw searchError;

      // Cast the data to ensure type safety
      setTravellers((data || []) as TravellersRow[]);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search travellers');
      toast.error("Failed to search travellers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    travellers,
    isLoading,
    error,
    searchTravellers
  };
};
