import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HotelForm } from "@/components/hotels/HotelForm";
import { HotelsTable } from "@/components/hotels/HotelsTable";
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { useState } from "react";
import { toast } from "sonner";

const HotelBank = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [editingHotel, setEditingHotel] = useState<HotelsRow | null>(null);

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
      setEditingHotel(null);
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
      setEditingHotel(null);
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

  const handleSubmit = async (values: any) => {
    if (editingHotel) {
      await updateHotelMutation.mutateAsync({ ...values, id: editingHotel.id });
    } else {
      await addHotelMutation.mutateAsync(values);
    }
  };

  const handleEdit = (hotel: HotelsRow) => {
    setEditingHotel(hotel);
  };

  const handleDelete = async (id: string) => {
    await deleteHotelMutation.mutateAsync(id);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Hotel Bank</h1>
          <p className="text-gray-400 mt-1">Manage your hotel inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-navy-light border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HotelForm
                defaultValues={editingHotel || undefined}
                onSubmit={handleSubmit}
                submitLabel={editingHotel ? 'Update Hotel' : 'Add Hotel'}
              />
            </CardContent>
          </Card>

          <Card className="bg-navy-light border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Hotels</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-white">Loading hotels...</p>
              ) : (
                <HotelsTable
                  hotels={hotels}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HotelBank;