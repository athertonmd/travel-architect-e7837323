
import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    if (!session?.user?.id) {
      return [];
    }

    try {
      const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (trips || []).map(trip => ({
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
      console.error('Error fetching trips:', error);
      return [];
    }
  }, [session?.user?.id]);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: trips = [], isLoading: isLoadingTrips, error } = useQuery({
    queryKey: ['trips', session?.user?.id],
    queryFn: fetchTrips,
    enabled: !!session?.user?.id,
  });

  // Handle loading state first
  if (loading || isLoadingTrips) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  // Then handle authentication
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Handle error state
  if (error) {
    console.error('Error in trips query:', error);
    toast.error('Unable to load trips. Please try again.');
  }

  // Finally render the dashboard
  return (
    <Layout>
      <div className="space-y-8">
        <DashboardHeader />
        <TripGrid trips={trips} isLoading={false} />
      </div>
    </Layout>
  );
};

export default Index;
