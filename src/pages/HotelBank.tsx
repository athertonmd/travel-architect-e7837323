import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSession } from '@supabase/auth-helpers-react';
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HotelForm } from "@/components/hotels/HotelForm";
import { HotelsTable } from "@/components/hotels/HotelsTable";
import { HotelSearch } from "@/components/hotels/HotelSearch";

const HotelBank = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [selectedHotel, setSelectedHotel] = useState<HotelsRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredHotels = hotels.filter((hotel) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      hotel.name?.toLowerCase().includes(searchLower) ||
      hotel.address?.toLowerCase().includes(searchLower) ||
      hotel.city?.toLowerCase().includes(searchLower) ||
      hotel.country?.toLowerCase().includes(searchLower)
    );
  });

  const addHotelMutation = useMutation({
    mutationFn: async (values: Omit<HotelsRow, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data, error } = await supabase
        .from('hotels')
        .insert([{ ...values, user_id: session?.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel added successfully');
      setIsDialogOpen(false);
      setSelectedHotel(null);
    },
    onError: (error) => {
      toast.error('Failed to add hotel: ' + error.message);
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: async (values: Omit<HotelsRow, 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data, error } = await supabase
        .from('hotels')
        .update(values)
        .eq('id', values.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel updated successfully');
      setIsDialogOpen(false);
      setSelectedHotel(null);
    },
    onError: (error) => {
      toast.error('Failed to update hotel: ' + error.message);
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete hotel: ' + error.message);
    },
  });

  const handleSubmit = async (values: Partial<HotelsRow>) => {
    if (selectedHotel) {
      await updateHotelMutation.mutateAsync({ ...values, id: selectedHotel.id } as HotelsRow);
    } else {
      await addHotelMutation.mutateAsync(values as Omit<HotelsRow, 'id' | 'created_at' | 'updated_at' | 'user_id'>);
    }
  };

  const handleEdit = (hotel: HotelsRow) => {
    setSelectedHotel(hotel);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteHotelMutation.mutateAsync(id);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Hotel Bank</h1>
            <p className="text-gray-400 mt-1">Manage your hotel inventory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedHotel(null);
                }}
                className="bg-navy border border-white hover:bg-navy/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedHotel ? "Edit Hotel" : "Add New Hotel"}
                </DialogTitle>
              </DialogHeader>
              <HotelForm
                defaultValues={selectedHotel || undefined}
                onSubmit={handleSubmit}
                submitLabel={selectedHotel ? "Update" : "Add"}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-md mb-6">
          <HotelSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {isLoading ? (
          <p className="text-white">Loading hotels...</p>
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
