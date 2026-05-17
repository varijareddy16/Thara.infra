/**
 * Supabase data hooks for Thara Infra.
 *
 * Each hook uses TanStack Query (already in the project) for caching,
 * background refetch, and optimistic updates.
 *
 * Naming convention:
 *   useProperties()        — public listing
 *   useAdminProperties()   — admin CRUD
 *   useLeads()             — admin/sales lead management
 *   useCareers()           — public + admin careers
 *   useAdminCareers()      — admin CRUD
 *   useAdminUsers()        — admin user management
 *   submitLead()           — public inquiry form submission
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type {
  Property,
  Lead,
  Career,
  Profile,
  LeadStatus,
} from "./supabase-types";

// Supabase's generic inference with a hand-written Database type can produce
// `never` for insert/update payloads. We cast to `any` only at the call site
// to avoid those errors while keeping full TypeScript types on returned data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTIES
// ─────────────────────────────────────────────────────────────────────────────

export function useProperties(opts?: { featured?: boolean; type?: string; status?: string }) {
  return useQuery({
    queryKey: ["properties", opts],
    queryFn: async () => {
      let q = db.from("properties").select("*").order("featured", { ascending: false });
      if (opts?.featured) q = q.eq("featured", true);
      if (opts?.type && opts.type !== "All") q = q.eq("type", opts.type);
      if (opts?.status && opts.status !== "All") q = q.eq("status", opts.status);
      const { data, error } = await q;
      if (error) throw error;
      return data as Property[];
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      const { data, error } = await db
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Property;
    },
    enabled: !!slug,
  });
}

export function useAdminProperties() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["admin", "properties"],
    queryFn: async () => {
      const { data, error } = await db
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Property[];
    },
  });

  const create = useMutation({
    mutationFn: async (p: Omit<Property, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await db.from("properties").insert(p).select().single();
      if (error) throw error;
      return data as Property;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "properties"] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Property> & { id: string }) => {
      const { data, error } = await db
        .from("properties")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Property;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "properties"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "properties"] }),
  });

  return { list, create, update, remove };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────────────────────────────────────

export function useLeads(filter?: LeadStatus | "All") {
  return useQuery({
    queryKey: ["leads", filter],
    queryFn: async () => {
      let q = db.from("leads").select("*").order("created_at", { ascending: false });
      if (filter && filter !== "All") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Lead[];
    },
  });
}

/** Public inquiry form — no auth required (RLS allows anon insert) */
export async function submitLead(lead: {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id?: string;
  property_name?: string;
  source?: string;
}) {
  const { error } = await db.from("leads").insert({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    property_id: lead.property_id ?? null,
    property_name: lead.property_name ?? null,
    status: "New",
    source: lead.source ?? "website",
    notes: "",
  });
  if (error) throw error;
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Lead> & { id: string }) => {
      const { data, error } = await db
        .from("leads")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Lead;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CAREERS
// ─────────────────────────────────────────────────────────────────────────────

/** Public — only active careers */
export function useCareers() {
  return useQuery({
    queryKey: ["careers", "public"],
    queryFn: async () => {
      const { data, error } = await db
        .from("careers")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Career[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useAdminCareers() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["admin", "careers"],
    queryFn: async () => {
      const { data, error } = await db
        .from("careers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Career[];
    },
  });

  const create = useMutation({
    mutationFn: async (c: Omit<Career, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await db.from("careers").insert(c).select().single();
      if (error) throw error;
      return data as Career;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "careers"] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Career> & { id: string }) => {
      const { data, error } = await db
        .from("careers")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Career;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "careers"] });
      qc.invalidateQueries({ queryKey: ["careers", "public"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("careers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "careers"] }),
  });

  return { list, create, update, remove };
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS / PROFILES (admin)
// ─────────────────────────────────────────────────────────────────────────────

export function useAdminUsers() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await db
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Profile["role"] }) => {
      const { data, error } = await db
        .from("profiles")
        .update({ role })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      // Deletes the profile row. Actual auth.users deletion requires
      // a Supabase Edge Function with the service-role key.
      const { error } = await db.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  return { list, updateRole, remove };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE — property images
// ─────────────────────────────────────────────────────────────────────────────

export async function uploadPropertyImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("property-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("property-images").getPublicUrl(path);
  return data.publicUrl;
}
