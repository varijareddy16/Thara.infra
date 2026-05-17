"use client";

import Link from "next/link";
import {
  Building2,
  Inbox,
  Briefcase,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  useAdminProperties,
  useAdminCareers,
  useAdminUsers,
} from "@/lib/supabase-queries";
import { useLeads } from "@/lib/supabase-queries";

function AdminDashboard() {
  const { list: propertiesQ } = useAdminProperties();
  const leadsQ = useLeads();
  const { list: careersQ } = useAdminCareers();
  const { list: usersQ } = useAdminUsers();

  const properties = propertiesQ.data ?? [];
  const leads = leadsQ.data ?? [];
  const careers = careersQ.data ?? [];
  const users = usersQ.data ?? [];

  const newLeads = leads.filter((e) => e.status === "New").length;
  const activeCareers = careers.filter((c) => c.active).length;
  const featured = properties.filter((p) => p.featured).length;

  const stats = [
    {
      label: "Properties",
      value: properties.length,
      sub: `${featured} featured`,
      icon: Building2,
      to: "/admin/properties",
    },
    {
      label: "Enquiries",
      value: leads.length,
      sub: `${newLeads} new`,
      icon: Inbox,
      to: "/admin/enquiries",
    },
    {
      label: "Open Roles",
      value: activeCareers,
      sub: `${careers.length} total`,
      icon: Briefcase,
      to: "/admin/careers",
    },
    {
      label: "Team",
      value: users.length,
      sub: `${users.filter((u) => u.role !== "customer").length} staff`,
      icon: Users,
      to: "/admin/users",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Overview</p>
          <h1 className="font-display text-4xl mt-2">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here's what's happening across Thara Infra today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-warm-brown bg-card border border-border rounded-full px-4 py-2 shadow-soft">
          <TrendingUp size={14} className="text-primary" /> Portfolio value up 12.4% MoM
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, to }) => (
          <Link
            key={label}
            href={to}
            className="group block bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-luxe transition-all hover-lift"
          >
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-full bg-gradient-warm grid place-items-center text-primary-foreground">
                <Icon size={18} />
              </div>
              <ArrowUpRight
                className="text-muted-foreground group-hover:text-primary transition-colors"
                size={18}
              />
            </div>
            <p className="mt-6 font-display text-4xl">{value}</p>
            <p className="text-sm text-warm-brown mt-1">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-display text-xl">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {leads.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {e.property_name ?? "—"} ·{" "}
                    {new Date(e.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${
                    e.status === "New"
                      ? "bg-primary/15 text-primary"
                      : e.status === "Contacted"
                        ? "bg-warm-brown/15 text-warm-brown"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {e.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">
                No enquiries yet.
              </p>
            )}
          </div>
        </div>

        {/* Featured Properties */}
        <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
          <h2 className="font-display text-xl">Featured Properties</h2>
          <ul className="mt-4 space-y-4">
            {properties
              .filter((p) => p.featured)
              .map((p) => (
                <li key={p.id} className="flex gap-3 items-center">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {p.location} · {p.price}
                    </p>
                  </div>
                </li>
              ))}
            {properties.filter((p) => p.featured).length === 0 && (
              <p className="text-sm text-muted-foreground">No featured properties.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
