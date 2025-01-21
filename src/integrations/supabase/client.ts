import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fakwoguybbzfpwokzhvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha3dvZ3V5YmJ6ZnB3b2t6aHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDM0NzAsImV4cCI6MjA1MDAxOTQ3MH0.A4hRFiR3GA8krWw6ZrUrKT2XiDBMGdQQI1Xj4LmcMYE";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined
        }
      }
    );
  }
  return supabaseInstance;
})();