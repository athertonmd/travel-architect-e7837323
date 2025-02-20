
import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { useUser, useSession } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

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

const fetchTrips = async (session: any): Promise<Trip[]> => {
  if (!session?.user?.id) {
    console.log('No valid session for fetchTrips');
    return [];
  }

  const userId = session.user.id;
  console.log('Fetching trips for user:', userId);

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
  const session = useSession();
  const user = useUser();

  useEffect(() => {
    console.log('Session state:', session);
    console.log('User state:', user);
  }, [session, user]);

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips', session?.user?.id],
    queryFn: () => fetchTrips(session),
    enabled: !!session?.user?.id,
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

  // If there's no session, redirect to auth
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If on /dashboard route, show the dashboard
  if (window.location.pathname === '/dashboard') {
    return (
      <Layout>
        <div className="space-y-8">
          <DashboardHeader />
          <TripGrid trips={trips} isLoading={isLoading} />
        </div>
      </Layout>
    );
  }

  // Otherwise, redirect to /dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
