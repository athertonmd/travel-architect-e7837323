import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function sendPdfViaEmail(tripId: string, userEmail: string, pdfBase64: string): Promise<void> {
  console.log("Sending PDF via email to:", userEmail);
  
  const { error: emailError } = await supabase.functions.invoke(
    "send-itinerary",
    {
      body: {
        tripId,
        to: [userEmail],
        pdfBase64
      }
    }
  );

  if (emailError) {
    console.error('Error sending email:', emailError);
    toast.error("PDF generated but failed to send email. Please try again later.");
    throw emailError;
  }

  console.log("Email sent successfully");
  toast.success("PDF generated and sent successfully!");
}