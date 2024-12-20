import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface TripTraveller {
  id: string;
  first_name: string;
  last_name: string;
}

interface TripTravellersSelectProps {
  tripId: string;
  selectedTravellers: TripTraveller[];
  onTravellersChange: (travellers: TripTraveller[]) => void;
}

export function TripTravellersSelect({ 
  tripId, 
  selectedTravellers, 
  onTravellersChange 
}: TripTravellersSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: availableTravellers } = useQuery({
    queryKey: ["travellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manage_travellers")
        .select("id, first_name, last_name")
        .order("first_name", { ascending: true });

      if (error) {
        toast.error("Failed to load travellers");
        throw error;
      }

      return data as TripTraveller[];
    },
  });

  const handleTravellerToggle = (traveller: TripTraveller) => {
    const isSelected = selectedTravellers.some(t => t.id === traveller.id);
    let newTravellers: TripTraveller[];

    if (isSelected) {
      newTravellers = selectedTravellers.filter(t => t.id !== traveller.id);
    } else {
      newTravellers = [...selectedTravellers, traveller];
    }

    onTravellersChange(newTravellers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <span>👤</span>
          Select Travellers ({selectedTravellers.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Travellers</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {availableTravellers?.map((traveller) => {
              const isSelected = selectedTravellers.some(t => t.id === traveller.id);
              return (
                <Button
                  key={traveller.id}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleTravellerToggle(traveller)}
                >
                  <span>
                    {traveller.first_name} {traveller.last_name}
                  </span>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-gray-300" />
                  )}
                </Button>
              );
            })}
            {(!availableTravellers || availableTravellers.length === 0) && (
              <div className="text-center text-sm text-muted-foreground py-4">
                No travellers found. Add them in the Manage Travellers page.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}