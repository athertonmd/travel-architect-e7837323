import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { TravellersRow } from "@/integrations/supabase/types/travellers"
import { supabase } from "@/integrations/supabase/client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TravellerSelectProps {
  onSelect: (traveller: TravellersRow) => void;
}

export function TravellerSelect({ onSelect }: TravellerSelectProps) {
  const [value, setValue] = useState("")
  const [travellers, setTravellers] = useState<TravellersRow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset travellers when searchQuery is empty
    if (!searchQuery || searchQuery.length === 0) {
      setTravellers([]);
    }
  }, [searchQuery]);

  const searchTravellers = async (query: string) => {
    setSearchQuery(query)
    setError(null)
    
    if (!query || query.length === 0) {
      setTravellers([]);
      return;
    }

    try {
      setIsLoading(true)
      console.log('Starting search with query:', query);

      const { data, error } = await supabase
        .from('manage_travellers')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5)

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        toast.error("Error searching for travellers");
        setTravellers([]);
        return;
      }

      // Ensure data is always an array
      const validData = Array.isArray(data) ? data : [];
      console.log('Processed travellers data:', validData);
      setTravellers(validData);
    } catch (error) {
      console.error('Unexpected error in searchTravellers:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast.error("Failed to search for travellers");
      setTravellers([]);
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (currentValue: string) => {
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
  };

  const renderContent = () => {
    if (error) {
      return <CommandEmpty>Error: {error}</CommandEmpty>;
    }

    if (isLoading) {
      return <CommandEmpty>Loading...</CommandEmpty>;
    }

    if (!Array.isArray(travellers) || travellers.length === 0) {
      return <CommandEmpty>No traveller found.</CommandEmpty>;
    }

    return (
      <CommandGroup>
        {travellers.map((traveller) => {
          const displayValue = `${traveller.first_name} ${traveller.last_name}`;
          return (
            <CommandItem
              key={traveller.id}
              value={displayValue}
              onSelect={(value) => handleSelect(value)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === displayValue ? "opacity-100" : "opacity-0"
                )}
              />
              {displayValue}
            </CommandItem>
          );
        })}
      </CommandGroup>
    );
  };

  return (
    <Command 
      className="border rounded-lg" 
      shouldFilter={false}
      value={value}
      onValueChange={(v) => setValue(v)}
    >
      <CommandInput 
        placeholder="Search traveller..." 
        value={searchQuery}
        onValueChange={searchTravellers}
      />
      {renderContent()}
    </Command>
  );
}