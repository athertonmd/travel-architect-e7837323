import { TripHeader } from "@/components/trip/TripHeader";
import { useSession } from '@supabase/auth-helpers-react';
import { SendItineraryDialog } from "./SendItineraryDialog";
import { PdfPreviewDialog } from "./PdfPreviewDialog";

interface TripToolbarProps {
  title: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
  tripId?: string;
  emailRecipients?: { name: string; email: string; }[];
  destination?: string;
  status?: "draft" | "in-progress" | "confirmed";
}

export function TripToolbar({ 
  title,
  onTitleChange,
  onSave,
  tripId,
  emailRecipients = [],
  destination,
  status
}: TripToolbarProps) {
  const session = useSession();
  const userEmail = session?.user?.email;

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex justify-between items-center">
        <TripHeader
          title={title}
          onTitleChange={onTitleChange}
          onSave={onSave}
          tripId={tripId}
          destination={destination}
          status={status}
        />
        <div className="flex gap-2">
          {tripId && emailRecipients && (
            <SendItineraryDialog
              tripId={tripId}
              travelers={emailRecipients}
            />
          )}
          {tripId && (
            <PdfPreviewDialog
              tripId={tripId}
              title={title}
              userEmail={userEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
}