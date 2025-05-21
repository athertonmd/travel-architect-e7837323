
import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TripHeaderProps {
  title: string;
  onTitleChange?: (title: string) => void;
  travelers?: number;
  onSave?: () => void;
  tripId?: string;
  destination?: string;
  status?: "draft" | "in-progress" | "confirmed";
}

export function TripHeader({ 
  title, 
  onTitleChange, 
  travelers, 
  onSave, 
  tripId,
  destination,
  status 
}: TripHeaderProps) {
  const queryClient = useQueryClient();

  const updateTripStatus = async () => {
    if (!tripId) return;
    
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: 'draft' } as any)
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
    if (onSave) {
      await updateTripStatus();
      onSave();
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <TripTitleHeader 
          title={title} 
          onTitleChange={onTitleChange} 
        />
        {destination && (
          <span className="text-sm text-gray-500">
            {destination}
          </span>
        )}
      </div>
      {onSave && (
        <div className="border-l pl-4 ml-4 border-white/20">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSave}
                  className="bg-navy hover:bg-navy-light border border-white"
                >
                  Save Changes
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save all changes made to this trip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
