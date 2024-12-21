import { Layout } from "@/components/Layout";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const navigate = useNavigate();
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

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4 p-6 border rounded-lg shadow-sm">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Travel Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your luxury travel itineraries</p>
          </div>
          <Button 
            className="bg-navy hover:bg-navy-light"
            onClick={() => navigate("/trips/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Trip
          </Button>
        </div>

        {error && (
          <div className="p-4 text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : trips.length > 0 ? (
            trips.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))
          ) : (
            <div className="col-span-full text-center p-8 border border-dashed rounded-lg">
              <p className="text-gray-500">No trips found. Create your first trip to get started!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;