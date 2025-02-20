
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HotelForm } from "./HotelForm";
import { HotelsRow } from "@/integrations/supabase/types/hotels";

interface HotelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHotel: HotelsRow | null;
  onSubmit: (values: Partial<HotelsRow>) => Promise<void>;
}

export function HotelDialog({ isOpen, onOpenChange, selectedHotel, onSubmit }: HotelDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {selectedHotel ? "Edit Hotel" : "Add New Hotel"}
        </DialogTitle>
      </DialogHeader>
      <HotelForm
        defaultValues={selectedHotel || undefined}
        onSubmit={onSubmit}
        submitLabel={selectedHotel ? "Update" : "Add"}
      />
    </DialogContent>
  );
}
