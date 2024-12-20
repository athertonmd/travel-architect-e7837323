import { Check } from "lucide-react"
import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { TravellersRow } from "@/integrations/supabase/types/travellers"
import { supabase } from "@/integrations/supabase/client"
import { cn } from "@/lib/utils"

interface TravellerSelectProps {
  onSelect: (traveller: TravellersRow) => void;
}

export function TravellerSelect({ onSelect }: TravellerSelectProps) {
  const [value, setValue] = useState("")
  const [travellers, setTravellers] = useState<TravellersRow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const searchTravellers = async (query: string) => {
    setSearchQuery(query)
    try {
      setIsLoading(true)
      if (query.length > 0) {
        console.log('Searching travellers with query:', query);
        const { data, error } = await supabase
          .from('manage_travellers')
          .select('*')
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
          .limit(5)

        if (error) {
          console.error('Error fetching travellers:', error);
          setTravellers([]);
          return;
        }

        console.log('Found travellers:', data);
        setTravellers(data || []);
      } else {
        setTravellers([]);
      }
    } catch (error) {
      console.error('Error in searchTravellers:', error);
      setTravellers([]);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Command className="border rounded-lg">
      <CommandInput 
        placeholder="Search traveller..." 
        value={searchQuery}
        onValueChange={searchTravellers}
      />
      {isLoading ? (
        <CommandEmpty>Loading...</CommandEmpty>
      ) : travellers.length === 0 ? (
        <CommandEmpty>No traveller found.</CommandEmpty>
      ) : (
        <CommandGroup>
          {travellers.map((traveller) => (
            <CommandItem
              key={traveller.id}
              value={`${traveller.first_name} ${traveller.last_name}`}
              onSelect={() => {
                onSelect(traveller)
                setValue(`${traveller.first_name} ${traveller.last_name}`)
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === `${traveller.first_name} ${traveller.last_name}` ? "opacity-100" : "opacity-0"
                )}
              />
              {traveller.first_name} {traveller.last_name}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  )
}