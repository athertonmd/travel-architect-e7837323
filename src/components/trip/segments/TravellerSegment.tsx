import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TravellersRow } from "@/integrations/supabase/types/travellers";

export function TravellerSegment() {
  const [selectedTravellers, setSelectedTravellers] = useState<TravellersRow[]>([]);
  const [open, setOpen] = useState(false);

  const { data: travellers = [] } = useQuery({
    queryKey: ['travellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manage_travellers')
        .select('*');
      
      if (error) throw error;
      return data as TravellersRow[];
    }
  });

  const handleSelectTraveller = (traveller: TravellersRow) => {
    if (!selectedTravellers.find(t => t.id === traveller.id)) {
      setSelectedTravellers([...selectedTravellers, traveller]);
    }
    setOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      {selectedTravellers.map((traveller) => (
        <div key={traveller.id} className="flex items-center gap-2 text-sm">
          <span>{traveller.first_name} {traveller.last_name}</span>
        </div>
      ))}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            Search Travellers
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Search travellers..." />
            <CommandEmpty>No traveller found.</CommandEmpty>
            <CommandGroup>
              {travellers.map((traveller) => (
                <CommandItem
                  key={traveller.id}
                  value={`${traveller.first_name} ${traveller.last_name}`}
                  onSelect={() => handleSelectTraveller(traveller)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {traveller.first_name} {traveller.last_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}