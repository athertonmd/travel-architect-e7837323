import { TripTitleHeader } from "@/components/trip/TripTitleHeader";
import { Button } from "@/components/ui/button";

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
      </div>
      <Button
        onClick={onSave}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Save Changes
      </Button>
    </div>
  );
}