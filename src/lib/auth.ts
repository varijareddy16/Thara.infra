/**
 * auth.ts — Supabase Auth helpers for Thara Infra.
 *
 * Two roles only: "admin" | "customer"
 * Role is ALWAYS read from public.profiles table — never from JWT metadata.
 */

import { useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Profile, UserRole } from "./supabase-types";

// Cast to any only for DB queries (avoids `never` from hand-written Database type)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Fetch profile from DB (not from JWT metadata) ───────────────────────────
async function fetchProfile(userId: string): Promise<Profile | null> {
  console.log("[auth] fetchProfile called for:", userId);

  const { data, error } = await db
    .from("profiles")
    .select("id, full_name, phone, role, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[auth] fetchProfile ERROR:", JSON.stringify(error));
    return null;
  }

  console.log("[auth] fetchProfile SUCCESS — role:", data?.role);
  return data as Profile;
}

// Creates a profile row if one doesn't exist yet (handles cases where
// the DB trigger didn't fire, e.g. schema was applied after user creation)
async function ensureProfile(userId: string, email: string, fullName?: string): Promise<Profile> {
  // Try to fetch first
  let profile = await fetchProfile(userId);
  if (profile) return profile;

  console.log("[auth] Profile missing — creating one now for:", userId);

  // Insert with default role = customer
  const { data, error } = await db
    .from("profiles")
    .insert({
      id: userId,
      full_name: fullName ?? email,
      role: "customer",
      phone: null,
      avatar_url: null,
    })
    .select()
    .single();

  if (error) {
    console.error("[auth] ensureProfile insert ERROR:", JSON.stringify(error));
    // Last resort — return a minimal in-memory profile
    return {
      id: userId,
      full_name: fullName ?? email,
      phone: null,
      role: "customer" as UserRole,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  console.log("[auth] Profile created — role:", data?.role);
  return data as Profile;
}

// ─── useSession ──────────────────────────────────────────────────────────────
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

// ─── useProfile ──────────────────────────────────────────────────────────────
// Always reads role from the DB. Never falls back to JWT metadata for role.
export function useProfile() {
  const { session, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string, email: string, fullName?: string) => {
    setLoading(true);
    const p = await ensureProfile(userId, email, fullName);
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    loadProfile(
      session.user.id,
      session.user.email ?? "",
      session.user.user_metadata?.full_name
    );
  }, [session, sessionLoading, loadProfile]);

  return { profile, loading };
}

// ─── useIsAdmin ───────────────────────────────────────────────────────────────
export function useIsAdmin() {
  const { profile, loading } = useProfile();
  return { isAdmin: profile?.role === "admin", loading };
}

// ─── signIn — returns role so caller can redirect immediately ─────────────────
export async function signIn(
  email: string,
  password: string
): Promise<{ session: Session; role: UserRole }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  if (!data.session) throw new Error("No session returned after login.");

  // Always fetch role from DB — never trust JWT metadata
  const profile = await ensureProfile(
    data.session.user.id,
    data.session.user.email ?? "",
    data.session.user.user_metadata?.full_name
  );

  console.log("[auth] signIn complete — role:", profile.role);
  return { session: data.session, role: profile.role };
}

// ─── signUp ───────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  fullName: string
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Do NOT store role in metadata — role lives only in public.profiles
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
}

// ─── signOut ──────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
