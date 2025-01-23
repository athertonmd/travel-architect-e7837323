import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { HotelsRow } from "@/integrations/supabase/types/hotels";
import { HotelBasicInfoFields } from "./form/HotelBasicInfoFields";
import { HotelContactFields } from "./form/HotelContactFields";

interface HotelFormProps {
  defaultValues?: Partial<HotelsRow>;
  onSubmit: (values: any) => Promise<void>;
  submitLabel: string;
}

export const HotelForm = ({ defaultValues, onSubmit, submitLabel }: HotelFormProps) => {
  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      country: "",
      telephone: "",
      website: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <HotelBasicInfoFields form={form} />
        <HotelContactFields form={form} />
        <Button type="submit" className="w-full">
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};