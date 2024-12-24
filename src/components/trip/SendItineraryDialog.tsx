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
    if (selectedEmails.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    // In development, warn if trying to send to emails other than the user's
    if (selectedEmails.some(email => email !== userEmail)) {
      toast.warning("In development mode, emails can only be sent to your own email address. Other recipients will be filtered out.");
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: {
          tripId,
          to: selectedEmails,
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
            Select the recipients for the trip itinerary
            {userEmail && (
              <p className="mt-2 text-sm text-yellow-600">
                Note: In development mode, emails can only be sent to your address ({userEmail})
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {travelers.map((traveler) => (
              <div key={traveler.email} className="flex items-center space-x-2">
                <Checkbox
                  id={traveler.email}
                  checked={selectedEmails.includes(traveler.email)}
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
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    traveler.email === userEmail ? 'text-green-600' : ''
                  }`}
                >
                  {traveler.name} ({traveler.email})
                  {traveler.email === userEmail && " (Your email)"}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSend}
            disabled={isSending}
            className="bg-navy hover:bg-navy-light text-white"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}