
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export function useHotels() {
  const session = useSession();

  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.error('No authenticated user found when fetching hotels');
        throw new Error('No authenticated user');
      }

      console.log('Fetching hotels for user:', session.user.id);
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hotels:', error);
        toast.error('Failed to load hotels. Please try again.');
        throw error;
      }

      console.log('Successfully fetched hotels:', data?.length || 0, 'hotels found');
      return data || [];
    },
    enabled: !!session?.user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
