
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PdfDesignFormValues } from "@/types/pdf";
import { usePdfSettings } from "./usePdfSettings";

// Form schema definition
const formSchema = z.object({
  // Appearance settings
  primaryColor: z.string().default("#1A1F2C"),
  secondaryColor: z.string().default("#D6BCFA"),
  accentColor: z.string().default("#9b87f5"),
  headerFont: z.string().default("Helvetica"),
  bodyFont: z.string().default("Helvetica"),
  logoUrl: z.string().optional(),
  
  // Content settings
  showPageNumbers: z.boolean().default(true),
  includeNotes: z.boolean().default(true),
  includeContactInfo: z.boolean().default(true),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  timeFormat: z.enum(["12h", "24h"]).default("12h"),
  
  // Header settings
  companyName: z.string().optional(),
  headerText: z.string().optional(),
  footerText: z.string().optional(),
});

export function usePdfDesignForm() {
  // Initialize form with default values
  const form = useForm<PdfDesignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: "#1A1F2C",
      secondaryColor: "#D6BCFA",
      accentColor: "#9b87f5",
      headerFont: "Helvetica",
      bodyFont: "Helvetica",
      showPageNumbers: true,
      includeNotes: true,
      includeContactInfo: true,
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
    },
  });

  const { isLoading, saveSettings } = usePdfSettings(form);

  const onSubmit = async (values: PdfDesignFormValues) => {
    await saveSettings(values);
  };

  return {
    form,
    isLoading,
    onSubmit
  };
}
