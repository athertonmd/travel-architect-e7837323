
import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

  // First, verify the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    throw sessionError;
  }

  if (!session) {
    console.error('No active session found');
    return [];
  }

  // Log the current user's session information
  console.log('Current session:', {
    user: session.user.id,
    email: session.user.email,
    aud: session.user.aud
  });

  // Fetch trips with detailed logging
  const { data: trips, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }

  console.log('Raw trips data:', trips);

  // Transform and validate the data
  const transformedTrips = trips?.map(trip => ({
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

  console.log('Transformed trips:', transformedTrips);
  return transformedTrips;
};

const Index = () => {
  const user = useUser();

  // Log user information when it changes
  useEffect(() => {
    if (user) {
      console.log('Current user:', {
        id: user.id,
        email: user.email,
        role: user.role
      });
    } else {
      console.log('No user found');
    }
  }, [user]);

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
    console.error('Error in trips query:', error);
    toast.error('Unable to load trips. Please try again.');
  }

  // Add loading state feedback
  useEffect(() => {
    console.log('Query state:', { isLoading, error: error ? 'Error present' : 'No error', tripsCount: trips.length });
  }, [isLoading, error, trips]);

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
