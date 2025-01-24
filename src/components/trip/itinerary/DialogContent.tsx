import {
  DialogContent as BaseDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecipientList } from "./RecipientList";

interface DialogContentProps {
  userEmail: string | undefined;
  recipients: { email: string; name: string }[];
  selectedEmails: string[];
  onSelectionChange: (emails: string[]) => void;
  onSend: () => void;
  isSending: boolean;
}

export function DialogContent({
  userEmail,
  recipients,
  selectedEmails,
  onSelectionChange,
  onSend,
  isSending,
}: DialogContentProps) {
  return (
    <BaseDialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Send Itinerary</DialogTitle>
        <DialogDescription>
          <p className="mb-2">Select recipients for the trip itinerary</p>
          <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            Important: In development mode, you can only send to athertonmd@gmail.com
          </div>
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-[300px] w-full pr-4">
        <RecipientList
          recipients={recipients}
          selectedEmails={selectedEmails}
          userEmail={userEmail}
          onSelectionChange={onSelectionChange}
        />
      </ScrollArea>
      <DialogFooter className="flex flex-row justify-between sm:justify-between gap-2">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <Button
          type="submit"
          onClick={onSend}
          disabled={isSending || selectedEmails.length === 0}
          className="bg-navy hover:bg-navy-light text-white"
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </DialogFooter>
    </BaseDialogContent>
  );
}