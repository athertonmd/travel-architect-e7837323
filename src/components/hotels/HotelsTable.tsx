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
            <TableHead className="text-white">Address</TableHead>
            <TableHead className="text-white">State/Province</TableHead>
            <TableHead className="text-white">Country</TableHead>
            <TableHead className="text-white">Contact</TableHead>
            <TableHead className="w-[100px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotels?.map((hotel) => (
            <TableRow key={hotel.id}>
              <TableCell className="text-white">{hotel.name}</TableCell>
              <TableCell className="text-white">{hotel.address}</TableCell>
              <TableCell className="text-white">{hotel.city}</TableCell>
              <TableCell className="text-white">{hotel.country}</TableCell>
              <TableCell className="text-white">
                <div className="space-y-1">
                  <p>{hotel.telephone}</p>
                  {hotel.website && (
                    <a 
                      href={hotel.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </TableCell>
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