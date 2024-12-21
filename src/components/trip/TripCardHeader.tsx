import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { TripStatusBadge } from "./TripStatusBadge";
import { TripActions } from "./TripActions";

interface TripCardHeaderProps {
  id: string;
  title: string;
  destination: string;
  status: "draft" | "confirmed" | "in-progress" | "completed" | "sent" | "agreed";
  onDelete: () => void;
  onArchive: () => void;
  archived?: boolean;
}

export function TripCardHeader({
  id,
  title,
  destination,
  status,
  onDelete,
  onArchive,
  archived
}: TripCardHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription className="flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {destination}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <TripStatusBadge status={status} tripId={id} />
          <TripActions 
            onDelete={onDelete}
            onArchive={onArchive}
            archived={archived}
          />
        </div>
      </div>
    </CardHeader>
  );
}