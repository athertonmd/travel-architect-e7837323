
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface HotelHeaderProps {
  onAddNewClick: () => void;
}

export function HotelHeader({ onAddNewClick }: HotelHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Hotel Bank</h1>
        <p className="text-gray-400 mt-1">Manage your hotel inventory</p>
      </div>
      <DialogTrigger asChild>
        <Button
          onClick={onAddNewClick}
          className="bg-navy border border-white hover:bg-navy/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </DialogTrigger>
    </div>
  );
}
