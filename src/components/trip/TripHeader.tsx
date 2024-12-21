import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TripHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  travelers?: number;
  onSave: () => void;
  tripId?: string;
}

export function TripHeader({ title, onTitleChange, travelers, onSave, tripId }: TripHeaderProps) {
  const queryClient = useQueryClient();

  const updateTripStatus = async () => {
    if (!tripId) return;
    
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: 'draft' })
        .eq('id', tripId);

      if (error) throw error;

      await queryClient.invalidateQueries({ 
        queryKey: ['trip', tripId],
        exact: true 
      });
      
      toast.success("Trip status reset to draft");
    } catch (error: any) {
      toast.error("Failed to update trip status");
      console.error("Status update error:", error);
    }
  };

  const handleSave = async () => {
    await updateTripStatus();
    onSave();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <TripTitleHeader title={title} onTitleChange={onTitleChange} />
      </div>
      <Button
        onClick={handleSave}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Save Changes
      </Button>
    </div>
  );
}