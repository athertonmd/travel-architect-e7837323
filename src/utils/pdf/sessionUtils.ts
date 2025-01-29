import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export async function getAuthenticatedSession(): Promise<Session> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Session error:", sessionError);
    throw new Error("Authentication error");
  }

  if (!session) {
    console.error("No active session found");
    throw new Error("No active session");
  }

  return session;
}