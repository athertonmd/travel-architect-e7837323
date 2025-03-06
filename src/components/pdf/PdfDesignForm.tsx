import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PdfPreview } from "./PdfPreview";
import { PdfSectionOrder } from "./PdfSectionOrder";
import { FontSelector } from "./FontSelector";
import { ColorSelector } from "./ColorSelector";
import { supabase } from "@/integrations/supabase/client";
import { PdfDesignFormValues, mapDbSettingsToFormValues, mapFormValuesToDbSettings } from "@/types/pdf";

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

export function PdfDesignForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session?.user?.id) {
          console.log("No user session found");
          setIsLoading(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Loading PDF settings for user:", userId);
        
        const { data, error } = await supabase
          .rpc('get_pdf_settings_for_user', { user_id_param: userId });
          
        if (error) {
          console.error('Error loading PDF settings:', error);
          throw error;
        }
        
        if (data) {
          console.log("Found PDF settings:", data);
          form.reset(mapDbSettingsToFormValues(data));
        } else {
          console.log("No PDF settings found for user");
        }
      } catch (error) {
        console.error('Error loading PDF settings:', error);
        toast({
          title: "Error loading settings",
          description: "There was a problem loading your settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [form, toast]);

  const onSubmit = async (values: PdfDesignFormValues) => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to save PDF settings",
          variant: "destructive",
        });
        return;
      }
      
      const userId = sessionData.session.user.id;
      const dbValues = mapFormValuesToDbSettings(values, userId);
      
      console.log("Saving PDF settings:", dbValues);
      
      const { error } = await supabase
        .from('pdf_settings')
        .upsert(dbValues, {
          onConflict: 'user_id',
        });
        
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your PDF design settings have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving PDF settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="bg-navy-light w-full justify-start mb-6">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="header">Header & Footer</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <ColorSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <ColorSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accent Color</FormLabel>
                        <ColorSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="headerFont"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Font</FormLabel>
                        <FontSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bodyFont"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Font</FormLabel>
                        <FontSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} className="text-white" />
                        </FormControl>
                        <FormDescription>
                          Enter a URL to your company logo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="showPageNumbers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Show Page Numbers</FormLabel>
                          <FormDescription>
                            Display page numbers at the bottom of each page
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeNotes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Include Notes</FormLabel>
                          <FormDescription>
                            Include any notes added to trip segments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeContactInfo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Include Contact Info</FormLabel>
                          <FormDescription>
                            Include contact information for hotels, airlines, etc.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how dates appear in your PDF
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                            <SelectItem value="24h">24-hour (13:30)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how times appear in your PDF
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="header" className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Name" {...field} className="text-white" />
                      </FormControl>
                      <FormDescription>
                        This will appear in the header of your PDF
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="headerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Custom header text" {...field} className="text-white" />
                      </FormControl>
                      <FormDescription>
                        Additional text to display in the header
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Footer Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Custom footer text" {...field} className="text-white" />
                      </FormControl>
                      <FormDescription>
                        Text to display in the footer of each page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sections" className="space-y-6">
              <FormLabel className="block mb-4">Section Order</FormLabel>
              <FormDescription className="mb-4">
                Drag and drop sections to rearrange how they appear in your PDF
              </FormDescription>
              <PdfSectionOrder />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <PdfPreview settings={form.watch()} />
      </div>
    </div>
  );
}
