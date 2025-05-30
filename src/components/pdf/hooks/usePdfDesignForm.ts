
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
  headerFont: z.string().default("Arial"),
  bodyFont: z.string().default("Arial"),
  logoUrl: z.string().optional().default(""),
  bannerImageUrl: z.string().optional().default(""),
  
  // Content settings
  showPageNumbers: z.boolean().default(true),
  includeNotes: z.boolean().default(true),
  includeContactInfo: z.boolean().default(true),
  includeQuickLinks: z.boolean().default(true),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  timeFormat: z.enum(["12h", "24h"]).default("12h"),
  
  // Header settings
  companyName: z.string().optional().default(""),
  headerText: z.string().optional().default(""),
  footerText: z.string().optional().default(""),
  
  // Section order
  sectionOrder: z.array(z.string()).optional().default(["quick-links", "notes"]),
  
  // Quick links
  quickLinks: z.array(z.object({
    name: z.string(),
    url: z.string()
  })).optional().default([
    { name: "Company Portal", url: "#" },
    { name: "Weather", url: "https://weather.com" },
    { name: "Visa & Passport", url: "https://travel.state.gov" },
    { name: "Currency Converter", url: "https://xe.com" },
    { name: "World Clock", url: "https://worldtimebuddy.com" },
  ]),
});

export function usePdfDesignForm() {
  // Initialize form with default values
  const form = useForm<PdfDesignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: "#1A1F2C",
      secondaryColor: "#D6BCFA",
      accentColor: "#9b87f5",
      headerFont: "Arial",
      bodyFont: "Arial",
      logoUrl: "",
      bannerImageUrl: "",
      showPageNumbers: true,
      includeNotes: true,
      includeContactInfo: true,
      includeQuickLinks: true,
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      companyName: "",
      headerText: "",
      footerText: "",
      sectionOrder: ["quick-links", "notes"],
      quickLinks: [
        { name: "Company Portal", url: "#" },
        { name: "Weather", url: "https://weather.com" },
        { name: "Visa & Passport", url: "https://travel.state.gov" },
        { name: "Currency Converter", url: "https://xe.com" },
        { name: "World Clock", url: "https://worldtimebuddy.com" },
      ],
    },
    mode: "onChange" // Add this to ensure form state updates as changes are made
  });

  const { isLoading, saveSettings } = usePdfSettings(form);

  const onSubmit = async (values: PdfDesignFormValues) => {
    // Log the values being submitted to help with debugging
    console.log("Submitting form values:", values);
    await saveSettings(values);
  };

  return {
    form,
    isLoading,
    onSubmit
  };
}
