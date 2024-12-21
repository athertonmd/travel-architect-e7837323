import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useArchiveTrip() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const archiveTrip = async (id: string, currentlyArchived: boolean) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ archived: !currentlyArchived })
        .eq('id', id);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success(
        currentlyArchived ? "Trip unarchived successfully" : "Trip archived successfully",
        { duration: 2000 }
      );

      if (!currentlyArchived) {
        navigate('/trips/archive');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return { archiveTrip };
}