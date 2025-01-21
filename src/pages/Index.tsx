import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Authentication error');
    }

    if (!session) {
      console.log('No active session found');
      throw new Error('No active session');
    }

    console.log('Fetching trips for user:', userId);
    const { data: rawTrips, error } = await supabase
      .from('trips')
      .select('id, title, destination, start_date, end_date, travelers, status, archived, segments')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!rawTrips) {
      console.log('No trips found');
      return [];
    }

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
  const navigate = useNavigate();
  const authCheckRef = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.log('No valid session found, redirecting to auth');
        navigate('/', { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: () => fetchTrips(user?.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (!user && !authCheckRef.current) {
      console.log('No user found, redirecting to auth page');
      navigate('/', { replace: true });
      return;
    }

    if (!user || authCheckRef.current) return;
    
    console.log('Setting up auth listener for user:', user.id);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to auth page');
        navigate('/', { replace: true });
      }
    });

    authCheckRef.current = true;

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
      authCheckRef.current = false;
    };
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching trips:', error);
      if ((error as Error).message === 'No active session') {
        navigate('/', { replace: true });
      } else {
        toast.error('Unable to load trips. Please check your connection and try again.');
      }
    }
  }, [error, navigate]);

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