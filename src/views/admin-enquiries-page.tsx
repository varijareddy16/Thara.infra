"use client";

import { useState } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { useLeads, useUpdateLead, useDeleteLead } from "@/lib/supabase-queries";
import type { LeadStatus } from "@/lib/supabase-types";

const STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Site Visit",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

function AdminEnquiries() {
  const [filter, setFilter] = useState<"All" | LeadStatus>("All");
  const leadsQ = useLeads(filter);
  const allLeadsQ = useLeads(); // for counts
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const leads = leadsQ.data ?? [];
  const allLeads = allLeadsQ.data ?? [];

  const updateStatus = (id: string, status: LeadStatus) => {
    updateLead.mutate({ id, status });
  };

  const remove = (id: string) => {
    if (confirm("Delete this enquiry?")) deleteLead.mutate(id);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Inbox</p>
        <h1 className="font-display text-4xl mt-2">Enquiries</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage prospective buyer enquiries.
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {(["All", ...STATUSES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em] border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-warm-brown hover:border-primary"
            }`}
          >
            {f}{" "}
            {f !== "All" &&
              `(${allLeads.filter((e) => e.status === f).length})`}
          </button>
        ))}
      </div>

      {leadsQ.isLoading && (
        <p className="text-sm text-muted-foreground">Loading enquiries…</p>
      )}

      <div className="grid gap-4">
        {leads.map((e) => (
          <article
            key={e.id}
            className="bg-card rounded-2xl border border-border shadow-soft p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl">{e.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Interested in{" "}
                  <span className="text-primary">
                    {e.property_name ?? "—"}
                  </span>{" "}
                  · {new Date(e.created_at).toLocaleDateString("en-IN")}
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-warm-brown">
                  <a
                    href={`mailto:${e.email}`}
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <Mail size={13} /> {e.email}
                  </a>
                  <a
                    href={`tel:${e.phone}`}
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <Phone size={13} /> {e.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={e.status}
                  onChange={(ev) =>
                    updateStatus(e.id, ev.target.value as LeadStatus)
                  }
                  className="px-3 py-2 rounded-full bg-ivory border border-border text-xs uppercase tracking-[0.18em] focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(e.id)}
                  className="h-9 w-9 grid place-items-center rounded-full hover:bg-destructive/10 text-warm-brown hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/80 leading-relaxed border-t border-border pt-4">
              {e.message}
            </p>
            {e.notes && (
              <p className="mt-2 text-xs text-warm-brown italic">
                Note: {e.notes}
              </p>
            )}
          </article>
        ))}
        {!leadsQ.isLoading && leads.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm bg-card rounded-2xl border border-border">
            No enquiries here.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEnquiries;
