import { Layout } from "@/components/Layout";
import { useSession } from '@supabase/auth-helpers-react';
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { HotelsTable } from "@/components/hotels/HotelsTable";
import { HotelSearch } from "@/components/hotels/HotelSearch";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HotelHeader } from "@/components/hotels/HotelHeader";
import { HotelDialog } from "@/components/hotels/HotelDialog";
import { useHotels } from "@/hooks/useHotels";
import { useHotelMutations } from "@/hooks/useHotelMutations";

const HotelBank = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState<HotelsRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const { data: hotels = [], isLoading } = useHotels();
  const { addHotelMutation, updateHotelMutation, deleteHotelMutation } = useHotelMutations();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          console.log('No active session, redirecting to auth page');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/auth');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (values: Partial<HotelsRow>) => {
    try {
      if (selectedHotel) {
        await updateHotelMutation.mutateAsync({ ...values, id: selectedHotel.id } as HotelsRow);
      } else {
        await addHotelMutation.mutateAsync(values as Omit<HotelsRow, 'id' | 'created_at' | 'updated_at' | 'user_id'>);
      }
      setIsDialogOpen(false);
      setSelectedHotel(null);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleEdit = (hotel: HotelsRow) => {
    setSelectedHotel(hotel);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHotelMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  const filteredHotels = hotels.filter((hotel) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      hotel.name?.toLowerCase().includes(searchLower) ||
      hotel.address?.toLowerCase().includes(searchLower) ||
      hotel.city?.toLowerCase().includes(searchLower) ||
      hotel.country?.toLowerCase().includes(searchLower)
    );
  });

  if (isCheckingAuth || !session) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white text-lg mb-2">Loading...</p>
            <p className="text-gray-400 text-sm">Please wait while we verify your session</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <HotelHeader onAddNewClick={() => {
            setSelectedHotel(null);
          }} />
          <HotelDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            selectedHotel={selectedHotel}
            onSubmit={handleSubmit}
          />
        </Dialog>

        <div className="max-w-md mb-6">
          <HotelSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-white text-lg mb-2">Loading hotels...</p>
            <p className="text-gray-400 text-sm">Please wait while we fetch your hotel data</p>
          </div>
        ) : (
          <HotelsTable
            hotels={filteredHotels}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
};

export default HotelBank;
