import { SendItineraryDialog } from "@/components/trip/SendItineraryDialog";
import { TripHeader } from "@/components/trip/TripHeader";
import { useSession } from '@supabase/auth-helpers-react';

interface TripToolbarProps {
  title: string;
  onTitleChange: (title: string) => void;
  travelers?: number;
  onSave: () => void;
  tripId?: string;
  emailRecipients: { email: string; name: string }[];
}

export function TripToolbar({ 
  title, 
  onTitleChange, 
  travelers, 
  onSave, 
  tripId,
  emailRecipients 
}: TripToolbarProps) {
  const session = useSession();
  const userEmail = session?.user?.email;
  
  // Add user to recipients list if they have an email
  const allRecipients = userEmail 
    ? [{ email: userEmail, name: 'Me (Your Email)' }, ...emailRecipients]
    : emailRecipients;

  return (
    <div className="flex justify-between items-center">
      <TripHeader 
        title={title}
        onTitleChange={onTitleChange}
        travelers={travelers}
        onSave={onSave}
        tripId={tripId}
      />
      {tripId && allRecipients.length > 0 && (
        <SendItineraryDialog tripId={tripId} travelers={allRecipients} />
      )}
    </div>
  );
}