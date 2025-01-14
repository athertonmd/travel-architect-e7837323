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
import { useState } from "react";

interface TripStatusBadgeProps {
  status: "draft" | "in-progress" | "confirmed";
  tripId: string;
}

export function TripStatusBadge({ status: initialStatus, tripId }: TripStatusBadgeProps) {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const queryClient = useQueryClient();

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "in-progress", label: "In Progress" },
    { value: "confirmed", label: "Confirmed" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ status: newStatus })
        .eq('id', tripId);

      if (error) throw error;

      setCurrentStatus(newStatus as typeof initialStatus);
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success(`Trip status updated to ${newStatus === "in-progress" ? "In Progress" : newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update trip status");
      console.error("Status update error:", error);
    }
  };

  const getDisplayStatus = (status: string) => {
    return status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div 
      className="action-button" 
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Badge 
            className={`${statusColors[currentStatus]} cursor-pointer flex items-center gap-1 hover:bg-opacity-90 transition-colors`}
          >
            {getDisplayStatus(currentStatus)}
            <ChevronDown className="h-3 w-3" />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="z-50 bg-white shadow-lg rounded-md border border-gray-200"
        >
          {statusOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {currentStatus === option.value && <Check className="h-4 w-4" />}
                <span>{option.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}