import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';

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

    // Ensure only the user's email is selected
    if (selectedEmails.some(email => email !== userEmail)) {
      toast.error(`In development mode, you can only send to your email (${userEmail})`);
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: {
          tripId,
          to: [userEmail], // Only send to user's email
        },
      });

      if (error) throw error;
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Itinerary</DialogTitle>
          <DialogDescription>
            <p className="mb-2">Select recipients for the trip itinerary</p>
            <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              Important: In development mode, you can only send to your email address ({userEmail})
            </div>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {travelers.map((traveler) => {
              const isUserEmail = traveler.email === userEmail;
              const isDisabled = !isUserEmail; // Disable non-user emails

              return (
                <div key={traveler.email} className="flex items-center space-x-2">
                  <Checkbox
                    id={traveler.email}
                    checked={selectedEmails.includes(traveler.email)}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      setSelectedEmails(prev =>
                        checked
                          ? [...prev, traveler.email]
                          : prev.filter(email => email !== traveler.email)
                      );
                    }}
                  />
                  <Label 
                    htmlFor={traveler.email} 
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                      isDisabled ? 'text-gray-400' : isUserEmail ? 'text-green-600' : ''
                    }`}
                  >
                    {traveler.name} ({traveler.email})
                    {isUserEmail && " (Your email)"}
                    {!isUserEmail && " (Disabled in development)"}
                  </Label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSend}
            disabled={isSending || selectedEmails.length === 0}
            className="bg-navy hover:bg-navy-light text-white"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}