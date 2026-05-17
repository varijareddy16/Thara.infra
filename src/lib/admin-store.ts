/**
 * admin-store.ts — Supabase-backed replacement.
 *
 * The old localStorage hooks are replaced by Supabase queries.
 * This file re-exports everything so existing imports keep working.
 *
 * Auth is now handled by Supabase Auth (see src/lib/auth.ts).
 * The legacy `login()` / `logout()` / `isAuthed()` helpers are kept as thin
 * wrappers so the admin login page can be migrated incrementally.
 */

export { useAdminProperties, useAdminCareers, useAdminUsers } from "./supabase-queries";

// Re-export lead hooks under the old "enquiries" name so admin.enquiries.tsx
// keeps working without changes.
export { useLeads as useAdminEnquiries } from "./supabase-queries";

// Re-export types
export type { Property } from "./supabase-types";
export type { Lead as Enquiry } from "./supabase-types";
export type { Career } from "./supabase-types";
export type { Profile as AdminUser } from "./supabase-types";

// ─── Legacy auth shims (used by admin.login.tsx and admin.tsx) ───────────────
// These delegate to Supabase Auth. The admin.login.tsx route is updated
// separately to call signIn() directly; these shims remain for any code
// that still imports from admin-store.

import { supabase } from "./supabase";
import { signIn as supabaseSignIn, signOut as supabaseSignOut } from "./auth";

/** @deprecated Use signIn() from src/lib/auth.ts */
export async function login(email: string, password: string): Promise<boolean> {
  try {
    await supabaseSignIn(email, password);
    return true;
  } catch {
    return false;
  }
}

/** @deprecated Use signOut() from src/lib/auth.ts */
export async function logout(): Promise<void> {
  await supabaseSignOut();
}

/** @deprecated Use useSession() from src/lib/auth.ts */
export function isAuthed(): boolean {
  // Synchronous check — reads from the Supabase session stored in localStorage.
  // This is only used in the legacy admin.tsx guard; the proper way is useSession().
  try {
    const raw = localStorage.getItem(
      `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost").hostname.split(".")[0]}-auth-token`
    );
    if (raw) {
      const parsed = JSON.parse(raw);
      return !!parsed?.access_token;
    }
  } catch {
    // ignore
  }
  return false;
}

/** Kept for backward compat — no longer needed with UUIDs */
export const newId = () => Math.random().toString(36).slice(2, 10);

// ─── Credentials hint (shown on login page) ──────────────────────────────────
// In production, remove this. Create your admin user via Supabase Auth and
// then run: UPDATE public.profiles SET role = 'admin' WHERE id = '<user-id>';
export const ADMIN_CREDS = {
  email: "admin@thara.in",
  note: "Set password in Supabase Auth dashboard, then promote role to 'admin' in profiles table.",
};

// ─── Supabase client (re-exported for convenience) ───────────────────────────
export { supabase };
