import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { DialogContent } from "./itinerary/DialogContent";

interface SendItineraryDialogProps {
  tripId: string;
  travelers: { email: string; name: string }[];
}

export function SendItineraryDialog({ tripId, travelers }: SendItineraryDialogProps) {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const session = useSession();
  const userEmail = session?.user?.email;
  
  const handleSend = async () => {
    if (!userEmail) {
      toast.error("You must be logged in to send itineraries");
      return;
    }

    if (selectedEmails.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    // In development, only allow sending to the user's email
    if (selectedEmails.some(email => email !== "athertonmd@gmail.com")) {
      toast.error("In development mode, you can only send to athertonmd@gmail.com");
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-itinerary", {
        body: {
          tripId,
          to: selectedEmails,
        },
      });

      if (error) throw error;
      
      console.log("Response from send-itinerary function:", data);
      toast.success("Itinerary sent successfully!");
    } catch (error: any) {
      console.error('Error sending itinerary:', error);
      const errorMessage = error.message || "Failed to send itinerary";
      toast.error(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-navy hover:bg-navy-light border border-white text-white"
        >
          Send Itinerary
        </Button>
      </DialogTrigger>
      <DialogContent
        userEmail={userEmail}
        recipients={travelers}
        selectedEmails={selectedEmails}
        onSelectionChange={setSelectedEmails}
        onSend={handleSend}
        isSending={isSending}
      />
    </Dialog>
  );
}