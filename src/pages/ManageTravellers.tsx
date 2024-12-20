import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@supabase/auth-helpers-react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Traveller = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  mobile_number: string | null;
};

const ManageTravellers = () => {
  const user = useUser();
  const [selectedTraveller, setSelectedTraveller] = useState<Traveller | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: travellers, refetch } = useQuery({
    queryKey: ["travellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manage_travellers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Traveller[];
    },
  });

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      if (selectedTraveller) {
        // Update existing traveller
        const { error } = await supabase
          .from("manage_travellers")
          .update(values)
          .eq("id", selectedTraveller.id);

        if (error) throw error;
        toast.success("Traveller updated successfully");
      } else {
        // Create new traveller
        const { error } = await supabase
          .from("manage_travellers")
          .insert([{ ...values, user_id: user?.id }]);

        if (error) throw error;
        toast.success("Traveller added successfully");
      }

      setIsDialogOpen(false);
      form.reset();
      setSelectedTraveller(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (traveller: Traveller) => {
    setSelectedTraveller(traveller);
    form.reset({
      first_name: traveller.first_name,
      last_name: traveller.last_name,
      email: traveller.email || "",
      mobile_number: traveller.mobile_number || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("manage_travellers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Traveller deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Manage Travellers</h1>
            <p className="text-gray-600 mt-1">Add and manage your travellers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedTraveller(null);
                  form.reset();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Traveller
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTraveller ? "Edit Traveller" : "Add New Traveller"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    {selectedTraveller ? "Update" : "Add"} Traveller
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

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
                        onClick={() => handleEdit(traveller)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(traveller.id)}
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
      </div>
    </Layout>
  );
};

export default ManageTravellers;