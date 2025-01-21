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
      console.error('Error fetching trips:', error);
      throw error;
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
    toast.error('Failed to load trips. Please try again.');
    return [];
  }
};

const Index = () => {
  const user = useUser();
  const lastEventTimeRef = useRef<number>(0);

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => fetchTrips(user?.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    // Set up auth state change listener with debouncing
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      const now = Date.now();
      if (now - lastEventTimeRef.current < 1000) {
        console.log('Debouncing auth state change event:', event);
        return; // Debounce events that fire too quickly
      }
      lastEventTimeRef.current = now;
      console.log('Auth state change event:', event);
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Error fetching trips:', error);
      toast.error('Error loading trips. Please refresh the page.');
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