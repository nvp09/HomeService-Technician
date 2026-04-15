import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createFallbackSupabaseClient = () => {
  const notConfiguredError = new Error(
    "Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );

  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: notConfiguredError };
      },
      async getUser() {
        return { data: { user: null }, error: notConfiguredError };
      },
      async signInWithPassword() {
        return { data: { user: null, session: null }, error: notConfiguredError };
      },
      async signOut() {
        return { error: null };
      },
    },
  };
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabaseClient();