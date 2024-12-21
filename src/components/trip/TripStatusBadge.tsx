import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TripStatusBadgeProps {
  status: "draft" | "confirmed" | "in-progress" | "completed" | "sent" | "agreed";
  tripId: string;
}

export function TripStatusBadge({ status, tripId }: TripStatusBadgeProps) {
  const queryClient = useQueryClient();

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    confirmed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
    sent: "bg-blue-100 text-blue-800",
    agreed: "bg-emerald-100 text-emerald-800",
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: newStatus })
        .eq('id', tripId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success(`Trip status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update trip status");
      console.error("Status update error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge 
          className={`${statusColors[status]} cursor-pointer flex items-center gap-1`}
        >
          {status}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange("sent")}>
          <div className="flex items-center gap-2">
            {status === "sent" && <Check className="h-4 w-4" />}
            <span className="text-blue-800">Sent</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("agreed")}>
          <div className="flex items-center gap-2">
            {status === "agreed" && <Check className="h-4 w-4" />}
            <span className="text-emerald-800">Agreed</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}