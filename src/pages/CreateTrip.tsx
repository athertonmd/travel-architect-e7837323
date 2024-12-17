import { Layout } from "@/components/Layout";

const CreateTrip = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Create New Trip</h1>
          <p className="text-gray-600 mt-1">Build a new luxury travel itinerary</p>
        </div>
        
        {/* Trip creation form will be added here in future updates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Start building your trip by adding segments below.</p>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;