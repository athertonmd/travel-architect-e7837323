import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { toast } from "sonner";

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

      setTravellers(Array.isArray(data) ? data : []);
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