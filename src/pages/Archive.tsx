import { Layout } from "@/components/Layout";
import { TripGrid } from "@/components/TripGrid";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';

const Archive = () => {
  const user = useUser();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchivedTrips = async () => {
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
          .eq('archived', true)
          .order('updated_at', { ascending: false });
        
        if (fetchError) {
          console.error('Error fetching archived trips:', fetchError);
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

    fetchArchivedTrips();
  }, [user]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Archived Trips</h1>
          <p className="text-white mt-1">View your archived travel itineraries</p>
        </div>

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

export default Archive;