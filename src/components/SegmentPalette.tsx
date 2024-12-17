import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function SegmentPalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold mb-4">Segment Types</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
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