
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export function useHotels() {
  const session = useSession();

  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      console.log('Fetching hotels with session:', session?.user?.id);
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hotels:', error);
        throw error;
      }
      console.log('Fetched hotels:', data);
      return data;
    },
    enabled: !!session?.user?.id,
  });
}
