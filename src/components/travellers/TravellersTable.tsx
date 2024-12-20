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
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {travellers?.map((traveller) => (
            <TableRow key={traveller.id}>
              <TableCell>{traveller.first_name}</TableCell>
              <TableCell>{traveller.last_name}</TableCell>
              <TableCell>{traveller.email}</TableCell>
              <TableCell>{traveller.mobile_number}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(traveller)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(traveller.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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
