import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { HotelsRow } from "@/integrations/supabase/types/hotels";

interface HotelContactFieldsProps {
  form: UseFormReturn<Partial<HotelsRow>>;
}

export const HotelContactFields = ({ form }: HotelContactFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="telephone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telephone Number</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} placeholder="+1 (555) 555-5555" />
            </FormControl>
            <FormDescription>
              Please enter the number in international format
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ''} type="url" placeholder="https://..." />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};