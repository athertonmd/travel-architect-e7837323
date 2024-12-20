import { Check } from "lucide-react";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface TravellerSearchResultsProps {
  isLoading: boolean;
  error: string | null;
  travellers: TravellersRow[];
  searchQuery: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const TravellerSearchResults = ({
  isLoading,
  error,
  travellers,
  searchQuery,
  selectedValue,
  onSelect
}: TravellerSearchResultsProps) => {
  const renderTravellerName = (traveller: TravellersRow) => 
    `${traveller.first_name} ${traveller.last_name}`;

  return (
    <>
      <CommandEmpty>
        {isLoading ? (
          "Searching..."
        ) : error ? (
          error
        ) : searchQuery.length < 2 ? (
          "Type at least 2 characters to search"
        ) : (
          "No travellers found"
        )}
      </CommandEmpty>
      <CommandGroup>
        {travellers.map((traveller) => {
          const travellerName = renderTravellerName(traveller);
          return (
            <CommandItem
              key={traveller.id}
              value={travellerName}
              onSelect={onSelect}
            >
              {travellerName}
              {selectedValue === travellerName && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </CommandItem>
          );
        })}
      </CommandGroup>
    </>
  );
};