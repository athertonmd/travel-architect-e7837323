import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HotelBank = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Hotel Bank</h1>
          <p className="text-gray-400 mt-1">Browse and manage your hotel inventory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example hotels - these would typically come from your database */}
          {[
            {
              name: "Grand Hyatt",
              location: "Singapore",
              rating: "5-star",
              description: "Luxury hotel in the heart of Singapore"
            },
            {
              name: "Ritz-Carlton",
              location: "Tokyo",
              rating: "5-star",
              description: "Premium luxury hotel with city views"
            },
            {
              name: "Four Seasons",
              location: "Paris",
              rating: "5-star",
              description: "Elegant hotel near the Champs-Élysées"
            }
          ].map((hotel, index) => (
            <Card key={index} className="bg-navy-light border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{hotel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Location:</strong> {hotel.location}</p>
                  <p><strong>Rating:</strong> {hotel.rating}</p>
                  <p>{hotel.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HotelBank;