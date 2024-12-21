import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

interface TripTitleHeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
}

export const TripTitleHeader = ({ title, onTitleChange }: TripTitleHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleTitleSubmit = () => {
    onTitleChange(editedTitle);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTitleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-3xl font-bold text-navy h-auto py-1"
            autoFocus
          />
          <Button type="submit" size="sm" variant="ghost">
            Save
          </Button>
        </form>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};