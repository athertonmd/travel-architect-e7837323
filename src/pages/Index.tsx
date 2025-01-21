import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "in-progress" | "confirmed";
  archived?: boolean;
  segments?: any[];
}

const isValidStatus = (status: string): status is "draft" | "in-progress" | "confirmed" => {
  return ["draft", "in-progress", "confirmed"].includes(status);
};

const fetchTrips = async (userId: string | undefined): Promise<Trip[]> => {
  if (!userId) {
    console.log('No user ID provided for fetching trips');
    return [];
  }

  console.log('Fetching trips for user:', userId);
  
  try {
    const { data: rawTrips, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      console.log('Request details:', {
        userId,
        requestUrl: 'https://fakwoguybbzfpwokzhvj.supabase.co/rest/v1/trips'
      });
      throw new Error(error.message);
    }

    if (!rawTrips) {
      console.log('No trips found');
      return [];
    }

    console.log('Raw trips data:', rawTrips);

    const transformedTrips: Trip[] = rawTrips.map(trip => ({
      id: trip.id,
      title: trip.title || '',
      destination: trip.destination || '',
      startDate: trip.start_date || '',
      endDate: trip.end_date || '',
      travelers: trip.travelers || 0,
      status: isValidStatus(trip.status) ? trip.status : 'draft',
      archived: trip.archived || false,
      segments: Array.isArray(trip.segments) ? trip.segments : []
    }));

    console.log('Transformed trips:', transformedTrips);
    return transformedTrips;
  } catch (error) {
    console.error('Error in fetchTrips:', error);
    throw error;
  }
};

const Index = () => {
  const user = useUser();
  const authCheckRef = useRef(false);

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => fetchTrips(user?.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    // Only set up the listener if it hasn't been set up yet
    if (authCheckRef.current) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event, 'Session:', session?.user?.id);
      
      // Don't do anything for these events to prevent loops
      if (['INITIAL_SESSION', 'TOKEN_REFRESHED'].includes(event)) {
        return;
      }
    });

    authCheckRef.current = true;

    return () => {
      subscription.unsubscribe();
      authCheckRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Error fetching trips:', error);
      toast.error('Unable to load trips. Please check your connection and try again.');
    }
  }, [error]);

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