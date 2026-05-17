"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminTopbar } from "@/components/AdminTopbar";
import { useSession, useProfile } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname?.endsWith("/admin/login");

  const { session, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading } = useProfile();

  const loading = sessionLoading || profileLoading;
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (loading || isLoginPage) return;

    if (!session) {
      router.push("/admin/login");
      return;
    }

    if (profile && !isAdmin) {
      router.push("/dashboard");
    }
  }, [loading, isLoginPage, session, profile, isAdmin, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-gradient-ivory">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="text-center">
          <p className="font-display text-3xl text-foreground">Access Denied</p>
          <p className="text-sm text-muted-foreground mt-2">
            This area is restricted to administrators only.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-full bg-gradient-warm text-primary-foreground px-6 py-2.5 text-sm font-medium"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ivory flex flex-col">
      <AdminTopbar />
      <main className="flex-1 container-luxe py-10">{children}</main>
      <footer className="border-t border-border bg-cream/50">
        <div className="container-luxe py-4 text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} Thara Infra — Admin Console</span>
          <span>v2.0</span>
        </div>
      </footer>
    </div>
  );
}
