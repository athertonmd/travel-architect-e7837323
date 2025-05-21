
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fakwoguybbzfpwokzhvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha3dvZ3V5YmJ6ZnB3b2t6aHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NDM0NzAsImV4cCI6MjA1MDAxOTQ3MH0.A4hRFiR3GA8krWw6ZrUrKT2XiDBMGdQQI1Xj4LmcMYE";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      flowType: 'pkce',
      debug: import.meta.env.DEV,
      // Prevent session data loss during page refreshes
      storageKey: 'supabase-auth',
      // Set a longer expiry time for the local session
      localStorage: {
        getItem: (key) => {
          try {
            return window.localStorage.getItem(key);
          } catch (error) {
            console.error('Error accessing localStorage:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            window.localStorage.setItem(key, value);
          } catch (error) {
            console.error('Error writing to localStorage:', error);
          }
        },
        removeItem: (key) => {
          try {
            window.localStorage.removeItem(key);
          } catch (error) {
            console.error('Error removing from localStorage:', error);
          }
        }
      }
    }
  }
);
