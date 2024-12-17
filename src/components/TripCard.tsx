import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";

interface TripCardProps {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "confirmed" | "in-progress" | "completed";
}

export function TripCard({ title, destination, startDate, endDate, travelers, status }: TripCardProps) {
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    confirmed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {destination}
            </CardDescription>
          </div>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm">
              {startDate} - {endDate}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm">{travelers} travelers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}