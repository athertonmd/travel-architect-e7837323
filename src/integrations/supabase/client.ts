import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fakwoguybbzfpwokzhvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha3dvZ3V5YmJ6ZnB3b2t6aHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDM0NzAsImV4cCI6MjA1MDAxOTQ3MH0.A4hRFiR3GA8krWw6ZrUrKT2XiDBMGdQQI1Xj4LmcMYE";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
);

console.log('Supabase client initialized with URL:', SUPABASE_URL);