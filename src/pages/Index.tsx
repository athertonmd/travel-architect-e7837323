
import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Session } from '@supabase/supabase-js';

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

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          console.log('Initial session loaded:', initialSession?.user?.email);
          setSession(initialSession);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        console.log('Auth state changed, new user email:', currentSession?.user?.email);
        setSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchTrips = useCallback(async () => {
    if (!session?.user?.id) {
      console.log('No session user ID, returning empty array');
      return [];
    }

    try {
      console.log('Fetching trips...');
      
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trips:', error);
        throw error;
      }

      if (!trips) {
        console.log('No trips found');
        return [];
      }

      console.log('Successfully fetched trips:', trips.length);
      
      return trips.map(trip => ({
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
    } catch (error) {
      console.error('Error in fetchTrips:', error);
      toast.error('Failed to load trips');
      return [];
    }
  }, [session?.user?.id]);

  const { data: trips = [], error: queryError, isLoading: isQueryLoading } = useQuery({
    queryKey: ['trips', session?.user?.id],
    queryFn: fetchTrips,
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    console.log('No session, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (queryError) {
    console.error('Error in trips query:', queryError);
    toast.error('Unable to load trips. Please try again.');
  }

  return (
    <Layout>
      <div className="space-y-8">
        <DashboardHeader session={session} />
        <TripGrid trips={trips} isLoading={isQueryLoading} />
      </div>
    </Layout>
  );
};

export default Index;
