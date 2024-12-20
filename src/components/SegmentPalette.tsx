import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TripTravellersSelect } from "@/components/trip/TripTravellersSelect";
import { useParams } from "react-router-dom";
import { useState } from "react";

export type SegmentType = {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
};

const segmentTypes: SegmentType[] = [
  { id: "flight", type: "flight", label: "Flight", icon: "✈️" },
  { id: "hotel", type: "hotel", label: "Hotel", icon: "🏨" },
  { id: "limo", type: "limo", label: "Limo Service", icon: "🚙" },
  { id: "car", type: "car", label: "Car Hire", icon: "🚗" },
  { id: "restaurant", type: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "activity", type: "activity", label: "Activity", icon: "🎯" },
  { id: "transfer", type: "transfer", label: "Transfer", icon: "🚕" },
  { id: "vip", type: "vip", label: "VIP Service", icon: "👑" },
];

interface TripTraveller {
  id: string;
  first_name: string;
  last_name: string;
}

export function SegmentPalette() {
  const { id: tripId } = useParams();
  const [selectedTravellers, setSelectedTravellers] = useState<TripTraveller[]>([]);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="font-semibold mb-4">Segment Types</h3>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          <TripTravellersSelect
            tripId={tripId || ''}
            selectedTravellers={selectedTravellers}
            onTravellersChange={setSelectedTravellers}
          />
          {segmentTypes.map((segment) => (
            <Button
              key={segment.id}
              variant="outline"
              className="w-full justify-start gap-2"
              draggable
              onDragStart={(e) => onDragStart(e, segment.type)}
            >
              <span>{segment.icon}</span>
              {segment.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}