import { Badge } from "@/components/ui/badge";

interface TripStatusBadgeProps {
  status: "draft" | "confirmed" | "in-progress" | "completed";
}

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    confirmed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
  };

  return (
    <Badge className={statusColors[status]}>{status}</Badge>
  );
}