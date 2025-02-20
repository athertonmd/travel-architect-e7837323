
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { DialogContent } from "./itinerary/DialogContent";
import { useQueryClient } from "@tanstack/react-query";

interface SendItineraryDialogProps {
  tripId: string;
  travelers: { email: string; name: string }[];
}

export function SendItineraryDialog({ tripId, travelers }: SendItineraryDialogProps) {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const session = useSession();
  const userEmail = session?.user?.email;
  const queryClient = useQueryClient();
  
  const handleSend = async () => {
    if (!userEmail || !session?.user?.id) {
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
      // Send the itinerary
      const { data, error: sendError } = await supabase.functions.invoke("send-itinerary", {
        body: {
          tripId,
          to: selectedEmails,
        },
      });

      if (sendError) throw sendError;
      
      // Update trip status to "sent"
      const { error: updateError } = await supabase
        .from('trips')
        .update({ status: 'sent' })
        .eq('id', tripId);

      if (updateError) throw updateError;

      // Record the notification
      const { error: notificationError } = await supabase
        .from('sent_notifications')
        .insert({
          trip_id: tripId,
          sent_by: session.user.id,
          recipients: selectedEmails,
        });

      if (notificationError) throw notificationError;

      // Invalidate queries to refresh UI
      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
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
