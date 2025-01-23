import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HotelSearch } from "@/components/hotels/HotelSearch";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HotelBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHotelSelect: (hotel: HotelsRow) => void;
}

export function HotelBankDialog({ open, onOpenChange, onHotelSelect }: HotelBankDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredHotels = hotels.filter((hotel) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      hotel.name?.toLowerCase().includes(searchLower) ||
      hotel.address?.toLowerCase().includes(searchLower) ||
      hotel.city?.toLowerCase().includes(searchLower) ||
      hotel.country?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Hotel from Bank</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <HotelSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <p className="text-center py-4">Loading hotels...</p>
          ) : (
            <div className="space-y-2">
              {filteredHotels.map((hotel) => (
                <button
                  key={hotel.id}
                  onClick={() => {
                    onHotelSelect(hotel);
                    onOpenChange(false);
                  }}
                  className="w-full p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <h3 className="font-medium">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">
                    {[hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ")}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}