"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession, useProfile, signOut } from "@/lib/auth";
import { useProperties } from "@/lib/supabase-queries";
import { PropertyCard } from "@/components/PropertyCard";
import { Loader2, LogOut, Building2, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";

function CustomerDashboard() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading } = useProfile();
  const { data: featuredProperties = [], isLoading: propertiesLoading } =
    useProperties({ featured: true });

  const loading = sessionLoading || profileLoading;

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.push("/login");
      return;
    }
    // Admins shouldn't be here
    if (profile?.role === "admin") {
      router.push("/admin");
    }
  }, [loading, session, profile, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!session) return null;

  const displayName = profile?.full_name ?? session.user.email ?? "Customer";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-ivory">
      {/* Dashboard Header */}
      <header className="bg-warm-brown text-ivory sticky top-0 z-40 border-b border-ivory/10">
        <div className="container-luxe flex items-center justify-between py-3">
          <Link href="/" className="font-display text-xl text-ivory">
            Thara Infra
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-ivory/80">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-medium">
                {initials}
              </div>
              <span className="hidden sm:inline">{displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-ivory/70 hover:text-primary transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container-luxe py-10 space-y-10">
        {/* Welcome */}
        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">My Dashboard</p>
          <h1 className="font-display text-4xl mt-2">
            Welcome back, {profile?.full_name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse properties, track your enquiries, and manage your profile.
          </p>
        </section>

        {/* Quick stats */}
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Building2, label: "Saved Properties", value: "0", sub: "Browse to save" },
            { icon: Mail, label: "My Enquiries", value: "0", sub: "Submit an enquiry" },
            { icon: Phone, label: "Site Visits", value: "0", sub: "Book a visit" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="bg-card rounded-2xl p-6 border border-border shadow-soft"
            >
              <div className="h-11 w-11 rounded-full bg-gradient-warm grid place-items-center text-primary-foreground">
                <Icon size={18} />
              </div>
              <p className="mt-5 font-display text-4xl">{value}</p>
              <p className="text-sm text-warm-brown mt-1">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Profile card */}
        <section className="bg-card rounded-2xl border border-border shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">My Profile</h2>
            <Link href="/contact"
              className="text-xs text-primary hover:underline"
            >
              Update via contact
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-warm text-primary-foreground grid place-items-center font-display text-2xl">
              {initials}
            </div>
            <div>
              <p className="font-medium text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
              <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-primary/15 text-primary">
                Customer
              </span>
            </div>
          </div>
        </section>

        {/* Featured properties */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">Featured Properties</h2>
            <Link href="/properties"
              className="text-sm text-warm-brown hover:text-primary"
            >
              View all →
            </Link>
          </div>

          {propertiesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-card border border-border animate-pulse h-72"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {featuredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-warm-brown rounded-2xl p-8 text-ivory">
          <h2 className="font-display text-2xl">Ready to find your home?</h2>
          <p className="text-ivory/75 text-sm mt-2 max-w-md">
            Explore our full portfolio of luxury residences across Hyderabad.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/properties"
              className="rounded-full bg-gradient-warm text-primary-foreground px-6 py-2.5 text-sm font-medium"
            >
              Browse Properties
            </Link>
            <Link href="/contact"
              className="rounded-full border border-ivory/30 text-ivory px-6 py-2.5 text-sm font-medium hover:bg-ivory/10 transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;
