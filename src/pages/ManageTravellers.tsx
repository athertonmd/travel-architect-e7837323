import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useUser } from "@supabase/auth-helpers-react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { TravellersTable } from "@/components/travellers/TravellersTable";
import { TravellerForm } from "@/components/travellers/TravellerForm";
import { TravellerSearch } from "@/components/travellers/TravellerSearch";
import { TravellersRow } from "@/integrations/supabase/types/travellers";

const ManageTravellers = () => {
  const user = useUser();
  const [selectedTraveller, setSelectedTraveller] = useState<TravellersRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: travellers, refetch } = useQuery({
    queryKey: ["travellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manage_travellers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TravellersRow[];
    },
  });

  const filteredTravellers = travellers?.filter((traveller) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      traveller.first_name.toLowerCase().includes(searchLower) ||
      traveller.last_name.toLowerCase().includes(searchLower) ||
      (traveller.email?.toLowerCase().includes(searchLower) ?? false)
    );
  });

  const handleSubmit = async (values: any) => {
    try {
      if (selectedTraveller) {
        const { error } = await supabase
          .from("manage_travellers")
          .update(values)
          .eq("id", selectedTraveller.id);

        if (error) throw error;
        toast.success("Traveller updated successfully");
      } else {
        const { error } = await supabase
          .from("manage_travellers")
          .insert([{ ...values, user_id: user?.id }]);

        if (error) throw error;
        toast.success("Traveller added successfully");
      }

      setIsDialogOpen(false);
      setSelectedTraveller(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (traveller: TravellersRow) => {
    setSelectedTraveller(traveller);
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
            <h1 className="text-3xl font-bold text-white">Manage Travellers</h1>
            <p className="text-gray-600 mt-1">Add and manage your travellers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedTraveller(null);
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
              <TravellerForm
                defaultValues={selectedTraveller || undefined}
                onSubmit={handleSubmit}
                submitLabel={selectedTraveller ? "Update" : "Add"}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-md mb-6">
          <TravellerSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <TravellersTable
          travellers={filteredTravellers || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default ManageTravellers;