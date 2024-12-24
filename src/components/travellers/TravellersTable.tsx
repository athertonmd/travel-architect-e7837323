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
import { TravellersRow } from "@/integrations/supabase/types/travellers";

interface TravellersTableProps {
  travellers: TravellersRow[];
  onEdit: (traveller: TravellersRow) => void;
  onDelete: (id: string) => void;
}

export const TravellersTable = ({ travellers, onEdit, onDelete }: TravellersTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">First Name</TableHead>
            <TableHead className="text-white">Last Name</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Mobile Number</TableHead>
            <TableHead className="w-[100px] text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {travellers?.map((traveller) => (
            <TableRow key={traveller.id}>
              <TableCell className="text-white">{traveller.first_name}</TableCell>
              <TableCell className="text-white">{traveller.last_name}</TableCell>
              <TableCell className="text-white">{traveller.email}</TableCell>
              <TableCell className="text-white">{traveller.mobile_number}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(traveller)}
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(traveller.id)}
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