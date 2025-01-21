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
  created_at: string;
  updated_at: string;
  user_id: string;
}

type TripStatus = "draft" | "in-progress" | "confirmed";

const isValidStatus = (status: string): status is TripStatus => {
  return ["draft", "in-progress", "confirmed"].includes(status);
};

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

  // Transform the data to ensure status is of the correct type and handle segments
  const transformedData: Trip[] = (data || []).map(trip => {
    // Ensure status is one of the valid types
    const status = isValidStatus(trip.status) ? trip.status : "draft";

    // Parse segments if they're stored as a string
    let segments;
    try {
      if (Array.isArray(trip.segments)) {
        segments = trip.segments;
      } else if (typeof trip.segments === 'string') {
        segments = JSON.parse(trip.segments);
      } else if (trip.segments) {
        segments = [trip.segments];
      } else {
        segments = [];
      }
    } catch (e) {
      console.error('Error parsing segments:', e);
      segments = [];
    }

    return {
      ...trip,
      status,
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
      destination: trip.destination || '',
      travelers: trip.travelers || 0,
      archived: trip.archived || false,
      segments
    };
  });

  console.log('Fetched trips:', transformedData);
  return transformedData;
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