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
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [travellers, setTravellers] = useState<TravellersRow[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const searchTravellers = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const { data, error } = await supabase
        .from('manage_travellers')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(5)

      if (!error && data) {
        setTravellers(data)
      }
    } else {
      setTravellers([])
    }
  }

  return (
    <Command className="border rounded-lg">
      <CommandInput 
        placeholder="Search traveller..." 
        value={searchQuery}
        onValueChange={searchTravellers}
      />
      <CommandEmpty>No traveller found.</CommandEmpty>
      <CommandGroup>
        {travellers.map((traveller) => (
          <CommandItem
            key={traveller.id}
            value={`${traveller.first_name} ${traveller.last_name}`}
            onSelect={() => {
              onSelect(traveller)
              setValue(`${traveller.first_name} ${traveller.last_name}`)
              setOpen(false)
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
    </Command>
  )
}