
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import { TravelportCredentialForm } from "@/components/travelport/TravelportCredentialForm";
import { TravelportInformationAlert } from "@/components/travelport/TravelportInformationAlert";
import { TravelportIntegrationProcess } from "@/components/travelport/TravelportIntegrationProcess";
import { TravelportFormNote } from "@/components/travelport/TravelportFormNote";
import { LoadingTravelportCredentials } from "@/components/travelport/LoadingTravelportCredentials";
import { useTravelportCredentials } from "@/hooks/useTravelportCredentials";

export default function TravelportCredentials() {
  const { isLoading } = useTravelportCredentials();

  if (isLoading) {
    return <LoadingTravelportCredentials />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link className="h-6 w-6 text-purple-500" />
          <h1 className="text-2xl font-bold tracking-tight">Travelport Credentials</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>GDS Requirements – Setting Up Travelport</CardTitle>
            <CardDescription>Please provide your Travelport GDS credentials to enable integration with Trip Builder</CardDescription>
          </CardHeader>
          <CardContent>
            <TravelportInformationAlert />
            <TravelportIntegrationProcess />
            <TravelportCredentialForm />
          </CardContent>
        </Card>
        
        <TravelportFormNote />
      </div>
    </Layout>
  );
}
