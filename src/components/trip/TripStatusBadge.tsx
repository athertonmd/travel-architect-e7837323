
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TripStatusBadgeProps {
  status: "draft" | "sent";
  tripId: string;
}

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    sent: "bg-green-100 text-green-800",
  };

  return (
    <div className="action-button">
      <Badge 
        className={`${statusColors[status]} flex items-center gap-1`}
      >
        {status === 'sent' && <Check className="h-3 w-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    </div>
  );
}
