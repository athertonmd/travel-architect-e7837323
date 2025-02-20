
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { HotelBasicInfoFields } from "./form/HotelBasicInfoFields";
import { HotelContactFields } from "./form/HotelContactFields";
import { toast } from "sonner";

interface HotelFormProps {
  defaultValues?: Partial<HotelsRow>;
  onSubmit: (values: Partial<HotelsRow>) => Promise<void>;
  submitLabel: string;
}

export const HotelForm = ({ defaultValues, onSubmit, submitLabel }: HotelFormProps) => {
  const form = useForm<Partial<HotelsRow>>({
    defaultValues: {
      name: "",
      address: null,
      city: null,
      country: null,
      telephone: null,
      website: null,
      zip_code: null,
      ...defaultValues,
    },
  });

  const handleSubmit = async (values: Partial<HotelsRow>) => {
    try {
      console.log('Submitting hotel form with values:', values);
      await onSubmit(values);
    } catch (error) {
      console.error('Error submitting hotel form:', error);
      toast.error('Failed to submit hotel. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <HotelBasicInfoFields form={form} />
        <HotelContactFields form={form} />
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};
