"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Inbox, Briefcase, Users, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { signOut } from "@/lib/auth";

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-warm-brown text-ivory border-b border-ivory/10">
      <div className="container-luxe flex items-center justify-between py-3 gap-6">
        <div className="flex items-center gap-3">
          <Logo tone="light" />
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.3em] text-primary border border-primary/40 px-2 py-1 rounded-full">
            Admin
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {nav.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : (pathname?.startsWith(href) ?? false);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-ivory/80 hover:text-ivory hover:bg-ivory/5"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-ivory/80 hover:text-primary transition-colors"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="lg:hidden border-t border-ivory/10 overflow-x-auto">
        <div className="container-luxe flex gap-1 py-2 text-xs">
          {nav.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : (pathname?.startsWith(href) ?? false);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap ${
                  active ? "bg-primary text-primary-foreground" : "text-ivory/80"
                }`}
              >
                <Icon size={13} /> {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
