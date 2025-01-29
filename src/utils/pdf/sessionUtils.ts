import { supabase } from "@/integrations/supabase/client";

export async function getAuthenticatedSession() {
  console.log("Getting authenticated session...");
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Session error:", sessionError);
    throw new Error("Authentication error");
  }

  if (!session) {
    console.error("No active session found");
    throw new Error("No active session");
  }

  console.log("Session retrieved successfully");
  return session;
}