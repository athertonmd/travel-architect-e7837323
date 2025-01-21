import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from "sonner";

const Index = () => {
  const user = useUser();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          setTrips([]);
          return;
        }
        
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .eq('archived', false)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching trips:', error);
          toast.error('Failed to load trips');
          return;
        }
        
        setTrips(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

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