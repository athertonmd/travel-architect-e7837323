import { Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { TravellersRow } from "@/integrations/supabase/types/travellers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TravellerSelectProps {
  onSelect: (traveller: TravellersRow) => void;
}

export const TravellerSelect = ({ onSelect }: TravellerSelectProps) => {
  const [travellers, setTravellers] = useState<TravellersRow[]>([]);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset travellers when search is cleared
  useEffect(() => {
    if (!searchQuery) {
      setTravellers([]);
    }
  }, [searchQuery]);

  // Memoized search function
  const searchTravellers = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setTravellers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await supabase
        .from("manage_travellers")
        .select("*")
        .or(
          `first_name.ilike.%${query}%,` +
          `last_name.ilike.%${query}%,` +
          `email.ilike.%${query}%`
        )
        .limit(5);

      if (searchError) {
        throw searchError;
      }

      // Ensure data is always an array
      const validData = Array.isArray(data) ? data : [];
      console.log('Processed travellers data:', validData);
      setTravellers(validData);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search travellers');
      toast.error("Failed to search travellers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
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
      try {
        onSelect(selectedTraveller);
        setValue(currentValue);
        setSearchQuery(""); // Clear search after selection
      } catch (error) {
        console.error('Error in handleSelect:', error);
        toast.error("Failed to select traveller");
      }
    }
  }, [travellers, onSelect]);

  // Render traveller name
  const renderTravellerName = useCallback((traveller: TravellersRow) => {
    return `${traveller.first_name} ${traveller.last_name}`;
  }, []);

  return (
    <Command shouldFilter={false} className="border rounded-md">
      <CommandInput
        placeholder="Search by name or email..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
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
              onSelect={handleSelect}
            >
              {travellerName}
              {value === travellerName && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  );
};