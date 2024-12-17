import { Layout } from "@/components/Layout";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Temporary mock data
const trips = [
  {
    title: "Luxury Mediterranean Cruise",
    destination: "Mediterranean Sea",
    startDate: "2024-06-15",
    endDate: "2024-06-30",
    travelers: 4,
    status: "confirmed" as const,
  },
  {
    title: "Safari Adventure",
    destination: "Kenya",
    startDate: "2024-07-10",
    endDate: "2024-07-20",
    travelers: 2,
    status: "draft" as const,
  },
  {
    title: "Tokyo Business Trip",
    destination: "Japan",
    startDate: "2024-05-01",
    endDate: "2024-05-07",
    travelers: 1,
    status: "in-progress" as const,
  },
];

const Index = () => {
  const navigate = useNavigate();

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
            <TripCard key={index} {...trip} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;