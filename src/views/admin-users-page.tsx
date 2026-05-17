"use client";

import { Trash2 } from "lucide-react";
import { useAdminUsers } from "@/lib/supabase-queries";
import type { UserRole } from "@/lib/supabase-types";

const ROLES: UserRole[] = ["admin", "customer"];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  customer: "Customer",
};

function AdminUsers() {
  const { list, updateRole, remove } = useAdminUsers();
  const users = list.data ?? [];

  const del = (id: string) => {
    if (confirm("Remove this user? This only removes the profile row."))
      remove.mutate(id);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Team</p>
          <h1 className="font-display text-4xl mt-2">Users & Roles</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage user roles. New users are created via Supabase Auth.
          </p>
        </div>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-warm text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-soft hover:shadow-luxe transition-all"
        >
          Invite via Supabase ↗
        </a>
      </header>

      {list.isLoading && (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-warm-brown">
            <tr className="text-left">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt={u.full_name ?? ""}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-warm text-primary-foreground grid place-items-center font-display">
                        {(u.full_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{u.full_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{u.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateRole.mutate({
                        id: u.id,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="px-3 py-1.5 rounded-full bg-ivory border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(u.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => del(u.id)}
                    className="h-8 w-8 inline-grid place-items-center rounded-full hover:bg-destructive/10 text-warm-brown hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {!list.isLoading && users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  No users yet. Invite users via the Supabase Auth dashboard.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
