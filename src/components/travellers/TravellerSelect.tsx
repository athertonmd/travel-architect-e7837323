import { useState, useEffect, useCallback } from "react";
import { Command, CommandInput } from "@/components/ui/command";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { useTravellerSearch } from "@/hooks/useTravellerSearch";
import { TravellerSearchResults } from "./TravellerSearchResults";

interface TravellerSelectProps {
  onSelect: (traveller: TravellersRow) => void;
}

export const TravellerSelect = ({ onSelect }: TravellerSelectProps) => {
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { travellers, isLoading, error, searchTravellers } = useTravellerSearch();

  // Reset travellers when search is cleared
  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      searchTravellers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchTravellers]);

  // Handle traveller selection
  const handleSelect = useCallback((currentValue: string) => {
    if (!currentValue) return;
    
    const selectedTraveller = travellers.find(traveller => {
      const fullName = `${traveller.first_name} ${traveller.last_name}`;
      return fullName === currentValue;
    });

    if (selectedTraveller) {
      onSelect(selectedTraveller);
      setValue(currentValue);
      setSearchQuery(""); // Clear search after selection
    }
  }, [travellers, onSelect]);

  return (
    <Command shouldFilter={false} className="border rounded-md">
      <CommandInput
        placeholder="Search by name or email..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <TravellerSearchResults
        isLoading={isLoading}
        error={error}
        travellers={travellers}
        searchQuery={searchQuery}
        selectedValue={value}
        onSelect={handleSelect}
      />
    </Command>
  );
};