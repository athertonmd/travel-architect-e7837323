import { SendItineraryDialog } from "@/components/trip/SendItineraryDialog";

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
  return (
    <div className="flex justify-between items-center">
      <TripHeader 
        title={title}
        onTitleChange={onTitleChange}
        travelers={travelers}
        onSave={onSave}
        tripId={tripId}
      />
      {tripId && emailRecipients.length > 0 && (
        <SendItineraryDialog tripId={tripId} travelers={emailRecipients} />
      )}
    </div>
  );
}