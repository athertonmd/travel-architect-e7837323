import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { HotelsRow } from "@/integrations/supabase/types/hotels";

interface HotelsTableProps {
  hotels: HotelsRow[];
  onEdit: (hotel: HotelsRow) => void;
  onDelete: (id: string) => void;
}

export const HotelsTable = ({ hotels, onEdit, onDelete }: HotelsTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Location</TableHead>
            <TableHead className="text-white">Rating</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="w-[100px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels?.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell className="text-white">{hotel.name}</TableCell>
              <TableCell className="text-white">{hotel.location}</TableCell>
              <TableCell className="text-white">{hotel.rating}</TableCell>
              <TableCell className="text-white">{hotel.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(hotel)}
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(hotel.id)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};