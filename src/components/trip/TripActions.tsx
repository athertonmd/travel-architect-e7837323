import { Archive, Trash2 } from "lucide-react";
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

interface TripActionsProps {
  onDelete: () => void;
  onArchive: () => void;
  archived?: boolean;
}

export function TripActions({ onDelete, onArchive, archived }: TripActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="action-button p-2 hover:bg-gray-100 rounded-full transition-colors"
            title={archived ? "Unarchive trip" : "Archive trip"}
          >
            <Archive className="h-4 w-4 text-gray-500 hover:text-blue-500" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {archived ? "Unarchive this trip?" : "Archive this trip?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {archived 
                ? "This trip will be moved back to your active trips."
                : "This trip will be moved to your archived trips. You can unarchive it later."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onArchive}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {archived ? "Unarchive" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="action-button p-2 hover:bg-gray-100 rounded-full transition-colors">
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
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}