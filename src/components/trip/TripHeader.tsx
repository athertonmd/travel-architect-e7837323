import { TripTitleHeader } from "@/components/trip/TripTitleHeader";

interface TripHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  travelers?: number;
  onSave: () => void;
}

export function TripHeader({ title, onTitleChange, travelers, onSave }: TripHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <TripTitleHeader title={title} onTitleChange={onTitleChange} />
        <div className="text-sm text-muted-foreground">
          {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
        </div>
      </div>
      <button
        onClick={onSave}
        className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Save Changes
      </button>
    </div>
  );
}