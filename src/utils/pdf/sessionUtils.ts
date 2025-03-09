
import { supabase } from "@/integrations/supabase/client";

export async function getAuthenticatedSession() {
  console.log("Getting authenticated session...");
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      throw new Error(`Authentication error: ${sessionError.message}`);
    }

    if (!session) {
      console.error("No active session found");
      throw new Error("No active user session. Please log in again.");
    }

    if (!session.access_token) {
      console.error("Session has no access token");
      throw new Error("Invalid session token. Please log in again.");
    }

    console.log("Session retrieved successfully, token length:", session.access_token.length);
    return session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    throw error;
  }
}
