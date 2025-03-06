
import { Layout } from "@/components/Layout";
import { FileText } from "lucide-react";
import { PdfDesignForm } from "@/components/pdf/PdfDesignForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PdfDesignSettings() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-bold tracking-tight">PDF Design Settings</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Customize Your PDF Itinerary</CardTitle>
            <CardDescription>Control how your trip itineraries look when exported to PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <PdfDesignForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
