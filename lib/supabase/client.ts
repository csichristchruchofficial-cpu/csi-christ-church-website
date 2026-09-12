import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Checks if real Supabase credentials have been configured in the environment.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
    key &&
    !url.includes("placeholder") &&
    !url.includes("your-project-id") &&
    !key.includes("your-anon-key") &&
    !key.includes("placeholder")
  );
}

/**
 * Creates a browser-side Supabase client using @supabase/ssr.
 * Safely falls back to placeholder credentials during build/prerender so
 * Next.js static generation on Vercel never fails when env vars are pending.
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
