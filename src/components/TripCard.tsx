import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "confirmed" | "in-progress" | "completed";
}

export function TripCard({ id, title, destination, startDate, endDate, travelers, status }: TripCardProps) {
  const navigate = useNavigate();
  
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    confirmed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-purple-100 text-purple-800",
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Trip deleted successfully");
      // Force a page refresh to update the trips list
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the delete button
    if ((e.target as HTMLElement).closest('.delete-button')) {
      e.stopPropagation();
      return;
    }
    navigate(`/trips/${id}`);
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer relative" 
      onClick={handleCardClick}
    >
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
            <Badge className={statusColors[status]}>{status}</Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="delete-button p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your trip.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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