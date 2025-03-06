
import React from "react";
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";

export function LoadingCredentials() {
  return (
    <Layout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto" />
          <p className="text-white/80">Loading your Sabre credentials...</p>
        </div>
      </div>
    </Layout>
  );
}
