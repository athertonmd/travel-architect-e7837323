import { TripHeader } from "@/components/trip/TripHeader";
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { Send, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TripToolbarProps {
  title: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
  tripId?: string;
  emailRecipients?: { name: string; email: string; }[];
  destination?: string;
  status?: "draft" | "in-progress" | "confirmed";
}

export function TripToolbar({ 
  title,
  onTitleChange,
  onSave,
  tripId,
  emailRecipients = [],
  destination,
  status
}: TripToolbarProps) {
  const session = useSession();

  const handlePdfDownload = async () => {
    if (!tripId) {
      toast.error("Trip ID is required to generate PDF");
      return;
    }

    try {
      toast.loading("Generating PDF...");
      
      const { data, error } = await supabase.functions.invoke('send-itinerary', {
        body: { tripId, generatePdfOnly: true }
      });

      if (error) throw error;

      // Convert base64 to Blob
      const pdfBlob = await fetch(`data:application/pdf;base64,${data.pdf}`).then(res => res.blob());
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-itinerary.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.dismiss();
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex justify-between items-center">
        <TripHeader
          title={title}
          onTitleChange={onTitleChange}
          onSave={onSave}
          tripId={tripId}
          destination={destination}
          status={status}
        />
        <div className="flex gap-2">
          <Button
            className="bg-navy hover:bg-navy-light border border-white text-white"
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
    </div>
  );
}