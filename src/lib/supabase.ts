import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase-types";

function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    ""
  );
}

function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    ""
  );
}

function createSupabaseClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      throw new Error(
        "Missing Supabase environment variables.\n\n" +
          "Create a file named .env.local in the project root with:\n\n" +
          "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n" +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n\n" +
          "Get both from Supabase → Settings → API.\n" +
          "Then restart: npm run dev"
      );
    }
    return createClient<Database>("https://placeholder.supabase.co", "placeholder", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = createSupabaseClient();
