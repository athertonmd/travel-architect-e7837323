import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";

const CreateTrip = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tripTitle, setTripTitle] = useState("Create New Trip");

  const handleTitleSubmit = () => {
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTitleSubmit();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  type="text"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="text-3xl font-bold text-navy h-auto py-1"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  size="sm"
                  variant="ghost"
                >
                  Save
                </Button>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-navy">{tripTitle}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
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