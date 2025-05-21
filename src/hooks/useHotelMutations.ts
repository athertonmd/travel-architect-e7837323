
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HotelsRow, HotelsInsert, HotelsUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

type HotelInput = Omit<HotelsRow, 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
  name: string;
};

export function useHotelMutations() {
  const session = useSession();
  const queryClient = useQueryClient();

  const addHotelMutation = useMutation({
    mutationFn: async (values: HotelInput) => {
      if (!session?.user?.id) {
        console.error('No authenticated user found when adding hotel');
        throw new Error('User must be logged in to add hotels');
      }

      console.log('Adding hotel with values:', values);
      const { data, error } = await supabase
        .from('hotels')
        .insert([{ ...values, user_id: session.user.id } as unknown as HotelsInsert])
        .select()
        .single();

      if (error) {
        console.error('Error adding hotel:', error);
        throw error;
      }
      
      console.log('Successfully added hotel:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel added successfully');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error('Failed to add hotel: ' + error.message);
    },
  });

  const updateHotelMutation = useMutation({
    mutationFn: async (values: HotelInput & { id: string }) => {
      if (!session?.user?.id) {
        console.error('No authenticated user found when updating hotel');
        throw new Error('User must be logged in to update hotels');
      }

      console.log('Updating hotel with values:', values);
      const { data, error } = await supabase
        .from('hotels')
        .update(values as unknown as HotelsUpdate)
        .eq('id', values.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating hotel:', error);
        throw error;
      }

      console.log('Successfully updated hotel:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel updated successfully');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update hotel: ' + error.message);
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) {
        console.error('No authenticated user found when deleting hotel');
        throw new Error('User must be logged in to delete hotels');
      }

      console.log('Deleting hotel with id:', id);
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting hotel:', error);
        throw error;
      }

      console.log('Successfully deleted hotel with id:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete hotel: ' + error.message);
    },
  });

  return {
    addHotelMutation,
    updateHotelMutation,
    deleteHotelMutation,
  };
}
