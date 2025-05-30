import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { TravellersRow } from "@/integrations/supabase/types/travellers";

interface TravellerFormProps {
  defaultValues?: Partial<TravellersRow>;
  onSubmit: (values: any) => Promise<void>;
  submitLabel: string;
}

export const TravellerForm = ({ defaultValues, onSubmit, submitLabel }: TravellerFormProps) => {
  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+1 (555) 555-5555"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Please enter the number in international format (e.g., +1 for US/Canada)
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};
