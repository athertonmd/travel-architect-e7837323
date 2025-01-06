import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { JsonValue } from "@/types/segment";

interface TravelerListProps {
  travelerNames: string[];
  emails: string[];
  mobileNumbers: string[];
  onRemove: (index: number) => void;
}

export function TravelerList({ 
  travelerNames, 
  emails, 
  mobileNumbers, 
  onRemove 
}: TravelerListProps) {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {travelerNames.map((name, index) => (
          <div key={index} className="flex items-start justify-between space-x-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-blue-500">{name}</p>
              {emails && (emails as string[])[index] && (
                <p className="text-muted-foreground">Email: {(emails as string[])[index]}</p>
              )}
              {mobileNumbers && (mobileNumbers as string[])[index] && (
                <p className="text-muted-foreground">Mobile: {(mobileNumbers as string[])[index]}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-700 hover:text-gray-900"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}