import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { Mail } from "lucide-react";

interface SendItineraryDialogProps {
  tripId: string;
  travelers: { email: string; name: string }[];
}

export function SendItineraryDialog({ tripId, travelers }: SendItineraryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const session = useSession();

  const handleSend = async () => {
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: { tripId, recipients: selectedEmails },
      });

      if (error) throw error;
      
      toast.success("Itinerary sent successfully!");
      setOpen(false);
    } catch (error: any) {
      console.error('Error sending itinerary:', error);
      toast.error("Failed to send itinerary");
    } finally {
      setLoading(false);
    }
  };

  const toggleEmail = (email: string) => {
    setSelectedEmails(current =>
      current.includes(email)
        ? current.filter(e => e !== email)
        : [...current, email]
    );
  };

  const uniqueTravelers = travelers.filter((traveler, index, self) =>
    index === self.findIndex(t => t.email === traveler.email)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-navy hover:bg-navy-light border border-white text-white"
        >
          <Mail className="mr-2 h-4 w-4" />
          Send Itinerary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-navy text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Send Itinerary</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            {session?.user?.email && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="self"
                  checked={selectedEmails.includes(session.user.email)}
                  onCheckedChange={() => toggleEmail(session.user.email)}
                />
                <Label htmlFor="self" className="text-white">
                  Send to myself ({session.user.email})
                </Label>
              </div>
            )}
            {uniqueTravelers.map((traveler) => (
              traveler.email && (
                <div key={traveler.email} className="flex items-center space-x-2">
                  <Checkbox
                    id={traveler.email}
                    checked={selectedEmails.includes(traveler.email)}
                    onCheckedChange={() => toggleEmail(traveler.email)}
                  />
                  <Label htmlFor={traveler.email} className="text-white">
                    {traveler.name} ({traveler.email})
                  </Label>
                </div>
              )
            ))}
          </div>
          <Button
            onClick={handleSend}
            disabled={loading || selectedEmails.length === 0}
            className="bg-navy hover:bg-navy-light border border-white text-white"
          >
            {loading ? "Sending..." : "Send Itinerary"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}