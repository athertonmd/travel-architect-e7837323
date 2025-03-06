import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileKey } from "lucide-react";
import { SabreCredentialForm } from "@/components/sabre/SabreCredentialForm";
import { SabreInformationAlert } from "@/components/sabre/SabreInformationAlert";
import { SabreIntegrationProcess } from "@/components/sabre/SabreIntegrationProcess";
import { SabreFormNote } from "@/components/sabre/SabreFormNote";
import { LoadingCredentials } from "@/components/sabre/LoadingCredentials";
import { useSabreCredentials } from "@/hooks/useSabreCredentials";
export default function SabreCredentials() {
  const {
    isLoading
  } = useSabreCredentials();
  if (isLoading) {
    return <LoadingCredentials />;
  }
  return <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileKey className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-bold tracking-tight">Sabre Credentials</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>GDS Requirements – Setting Up a New Sabre TMC</CardTitle>
            <CardDescription>Please provide your Sabre GDS credentials to enable integration with Trip Builder</CardDescription>
          </CardHeader>
          <CardContent>
            <SabreInformationAlert />
            <SabreIntegrationProcess />
            <SabreCredentialForm />
          </CardContent>
        </Card>
        
        <SabreFormNote />
      </div>
    </Layout>;
}