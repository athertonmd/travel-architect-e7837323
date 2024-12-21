import { Layout } from "@/components/Layout";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TripGrid } from "@/components/TripGrid";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';

const Index = () => {
  const user = useUser();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!user) {
          setTrips([]);
          return;
        }
        
        const { data, error: fetchError } = await supabase
          .from('trips')
          .select('*')
          .eq('archived', false)
          .order('created_at', { ascending: false });
        
        if (fetchError) {
          console.error('Error fetching trips:', fetchError);
          setError(fetchError.message);
          return;
        }
        
        setTrips(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
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

        {error && (
          <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <TripGrid trips={trips} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Index;