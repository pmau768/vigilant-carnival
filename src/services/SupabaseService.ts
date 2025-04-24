import { createClient } from '@supabase/supabase-js';

// Get the environment variables with fallbacks for safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create and export the supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    realtime: { params: { eventsPerSecond: 1 } }   // throttle
  }
);

// Log to help with debugging - remove in production
console.log('Supabase client initialized with URL:', supabaseUrl);

// Auth helpers
export const signUp = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getSession = async () => {
  return supabase.auth.getSession();
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
}; 