import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Trip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  status: "draft" | "in-progress" | "confirmed";
  archived: boolean;
  segments?: any[];
}

const fetchTrips = async (userId: string): Promise<Trip[]> => {
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
    retry: 2
  });

  // Handle query errors
  if (error) {
    console.error('Error loading trips:', error);
    toast.error('Failed to load trips. Please try again.');
  }

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