"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { useSession, useProfile, signOut } from "@/lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { session } = useSession();
  const { profile } = useProfile();

  const isAdmin = profile?.role === "admin";
  const displayName = profile?.full_name ?? session?.user?.email ?? "Account";
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-luxe flex items-center justify-between py-3 md:py-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9 text-sm">
          {nav.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={`text-foreground/80 hover:text-primary transition-colors ${
                (item.to === "/"
                  ? pathname === "/"
                  : (pathname?.startsWith(item.to) ?? false))
                  ? "text-primary font-medium"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-warm-brown hover:text-primary transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-warm text-primary-foreground grid place-items-center text-xs font-medium">
                  {initials}
                </div>
                <span className="max-w-[120px] truncate hidden sm:inline">{displayName}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-luxe overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-primary mt-0.5">
                      {profile?.role ?? "customer"}
                    </p>
                  </div>

                  {/* Admin-only link */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-warm-brown hover:bg-cream hover:text-primary transition-colors"
                    >
                      <LayoutDashboard size={14} /> Admin Console
                    </Link>
                  )}

                  {/* Customer dashboard */}
                  {!isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-warm-brown hover:bg-cream hover:text-primary transition-colors"
                    >
                      <User size={14} /> My Dashboard
                    </Link>
                  )}

                  <div className="border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-warm-brown hover:text-primary transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gradient-warm px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-luxe transition-all"
          >
            Enquire Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 text-warm-brown"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-ivory">
          <div className="container-luxe py-4 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-foreground/80 ${
                  (item.to === "/"
                  ? pathname === "/"
                  : (pathname?.startsWith(item.to) ?? false))
                    ? "text-primary font-medium"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}

            {session ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-foreground/80 flex items-center gap-2"
                  >
                    <LayoutDashboard size={14} /> Admin Console
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-foreground/80 flex items-center gap-2"
                  >
                    <User size={14} /> My Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="mt-1 py-2 text-sm text-destructive flex items-center gap-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2 text-foreground/80"
              >
                Login
              </Link>
            )}

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-warm px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
