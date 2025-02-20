
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";

export function useHotelMutations() {
  const session = useSession();
  const queryClient = useQueryClient();

  const addHotelMutation = useMutation({
    mutationFn: async (values: Omit<HotelsRow, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!session?.user?.id) {
        throw new Error('User must be logged in to add hotels');
      }

      const { data, error } = await supabase
        .from('hotels')
        .insert([{ ...values, user_id: session.user.id }])
        .select()
        .single();

      if (error) throw error;
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
    mutationFn: async (values: Omit<HotelsRow, 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!session?.user?.id) {
        throw new Error('User must be logged in to update hotels');
      }

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
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update hotel: ' + error.message);
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) {
        throw new Error('User must be logged in to delete hotels');
      }

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
