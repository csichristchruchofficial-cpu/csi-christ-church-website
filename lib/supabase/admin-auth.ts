import { createServerSupabaseClient } from "./server";
import { isSupabaseConfigured } from "./client";

export type AdminAuthResult =
  | {
      authorized: true;
      user: {
        id: string;
        email?: string;
      };
      supabase: ReturnType<typeof createServerSupabaseClient>;
    }
  | {
      authorized: false;
      user: null | {
        id: string;
        email?: string;
      };
      error: string;
      supabase: ReturnType<typeof createServerSupabaseClient>;
    };

/**
 * Server-side helper to verify that the request is made by an authenticated
 * user who exists in the public.admins table.
 *
 * Used to guard every admin API mutation and protected server routes.
 */
export async function verifyAdminSession(): Promise<AdminAuthResult> {
  const supabase = createServerSupabaseClient();

  // If Supabase credentials have not been configured yet
  if (!isSupabaseConfigured()) {
    return {
      authorized: false,
      user: null,
      error: "Supabase database credentials are not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
      supabase,
    };
  }

  // 1. Get authenticated user from session cookie
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      authorized: false,
      user: null,
      error: "Authentication required. Please log in.",
      supabase,
    };
  }

  // 2. Verify user exists in the admins table
  const { data: adminRecord, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    return {
      authorized: false,
      user: {
        id: user.id,
        email: user.email,
      },
      error: "Access Denied: Your account is not registered as an administrator.",
      supabase,
    };
  }

  return {
    authorized: true,
    user: {
      id: user.id,
      email: user.email,
    },
    supabase,
  };
}

