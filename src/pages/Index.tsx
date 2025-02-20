
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
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "sent";
  archived?: boolean;
  segments?: any[];
}

const isValidStatus = (status: string): status is "draft" | "sent" => {
  return ["draft", "sent"].includes(status);
};

const fetchTrips = async (userId: string | undefined): Promise<Trip[]> => {
  if (!userId) {
    console.log('No user ID provided to fetchTrips');
    return [];
  }

  console.log('Fetching trips for user:', userId);

  const { data: trips, error } = await supabase
    .from('trips')
    .select('id, title, destination, start_date, end_date, travelers, status, archived, segments')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }

  console.log('Fetched trips:', trips);

  return trips?.map(trip => ({
    id: trip.id,
    title: trip.title || '',
    destination: trip.destination || '',
    startDate: trip.start_date || '',
    endDate: trip.end_date || '',
    travelers: trip.travelers || 0,
    status: isValidStatus(trip.status) ? trip.status : 'draft',
    archived: trip.archived || false,
    segments: Array.isArray(trip.segments) ? trip.segments : []
  })) || [];
};

const Index = () => {
  const user = useUser();

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => fetchTrips(user?.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: 'Unable to load trips. Please try again.'
    }
  });

  // Handle error state
  if (error) {
    console.error('Error fetching trips:', error);
    toast.error('Unable to load trips. Please try again.');
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
