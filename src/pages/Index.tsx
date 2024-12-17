import { Layout } from "@/components/Layout";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from '@supabase/auth-helpers-react';

const Index = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching trips:', error);
        return;
      }
      
      setTrips(data || []);
    };

    fetchTrips();
  }, [user]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Travel Dashboard</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;