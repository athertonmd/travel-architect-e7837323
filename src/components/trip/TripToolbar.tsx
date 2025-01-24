import { TripHeader } from "@/components/trip/TripHeader";
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Send, FileText } from "lucide-react";

interface TripToolbarProps {
  title: string;
  destination?: string;
  status: "draft" | "in-progress" | "confirmed";
  onSendItinerary?: () => void;
}

export function TripToolbar({ 
  title, 
  destination, 
  status,
  onSendItinerary 
}: TripToolbarProps) {
  const session = useSession();

  const handlePdfDownload = () => {
    console.log('Downloading PDF...');
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      <TripHeader
        title={title}
        destination={destination}
        status={status}
      />
      <div className="flex gap-2">
        <Button
          className="bg-navy hover:bg-navy-light border border-white text-white"
          onClick={onSendItinerary}
        >
          <Send className="mr-2 h-4 w-4" />
          Send Itinerary
        </Button>
        <Button
          className="bg-navy hover:bg-navy-light border border-white text-white"
          onClick={handlePdfDownload}
        >
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div>
    </div>
  );
}