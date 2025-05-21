
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { useHotels } from "@/hooks/useHotels";
import { useCallback } from "react";

interface HotelBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHotelSelect: (hotel: HotelsRow) => void;
}

export function HotelBankDialog({ open, onOpenChange, onHotelSelect }: HotelBankDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { hotels, isLoading } = useHotels();

  const filteredHotels = useCallback(() => {
    if (!searchQuery.trim()) return hotels;
    
    const query = searchQuery.toLowerCase();
    return hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(query) || 
      hotel.location?.toLowerCase().includes(query) || 
      hotel.country?.toLowerCase().includes(query)
    );
  }, [searchQuery, hotels]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hotel Bank</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-blue-500">Search Hotels</Label>
            <Input 
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or country"
              className="bg-white border-gray-200"
            />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <span>Loading hotels...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHotels().length > 0 ? (
                <div className="space-y-2">
                  {filteredHotels().map((hotel) => (
                    <div 
                      key={hotel.id} 
                      className="bg-white p-3 rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        onHotelSelect(hotel);
                        onOpenChange(false);
                      }}
                    >
                      <p className="font-medium text-blue-500">{hotel.name}</p>
                      <p className="text-sm text-gray-600">
                        {[hotel.address, hotel.city, hotel.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-white rounded-md border border-gray-200">
                  <p className="text-gray-500">No hotels found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
