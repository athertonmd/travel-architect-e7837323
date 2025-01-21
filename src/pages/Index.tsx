import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const fetchTrips = async (userId: string) => {
  console.log('Fetching trips for user:', userId);
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }

  console.log('Fetched trips:', data);
  return data || [];
};

const Index = () => {
  const user = useUser();

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => user ? fetchTrips(user.id) : Promise.resolve([]),
    enabled: !!user,
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Error in trips query:', error);
        toast.error('Failed to load trips. Please try again.');
      }
    }
  });

  return (
    <Layout>
      <div className="space-y-8">
        <DashboardHeader />
        <TripGrid trips={trips} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Index;