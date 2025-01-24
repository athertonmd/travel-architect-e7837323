import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Recipient {
  email: string;
  name: string;
}

interface RecipientListProps {
  recipients: Recipient[];
  selectedEmails: string[];
  userEmail: string | undefined;
  onSelectionChange: (emails: string[]) => void;
}

export function RecipientList({
  recipients,
  selectedEmails,
  userEmail,
  onSelectionChange,
}: RecipientListProps) {
  const handleCheckboxChange = (email: string, checked: boolean) => {
    onSelectionChange(
      checked
        ? [...selectedEmails, email]
        : selectedEmails.filter((e) => e !== email)
    );
  };

  return (
    <div className="space-y-4">
      {recipients.map((recipient) => {
        const isAllowedEmail = recipient.email === "athertonmd@gmail.com";
        const isDisabled = !isAllowedEmail;

        return (
          <div key={recipient.email} className="flex items-center space-x-2">
            <Checkbox
              id={recipient.email}
              checked={selectedEmails.includes(recipient.email)}
              disabled={isDisabled}
              onCheckedChange={(checked) => {
                handleCheckboxChange(recipient.email, checked as boolean);
              }}
            />
            <Label
              htmlFor={recipient.email}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed ${
                isDisabled ? 'text-gray-400' : isAllowedEmail ? 'text-green-600' : ''
              }`}
            >
              {recipient.name} ({recipient.email})
              {isAllowedEmail && " (Allowed in development)"}
              {!isAllowedEmail && " (Disabled in development)"}
            </Label>
          </div>
        );
      })}
    </div>
  );
}