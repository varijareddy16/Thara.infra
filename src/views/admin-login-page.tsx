"use client";

import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { ShieldCheck, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { role } = await signIn(email, password);

      if (role === "admin") {
        window.location.replace("/admin");
      } else {
        // Not an admin — send to customer dashboard
        setError("This login is for administrators only.");
        setSubmitting(false);
        // Sign them out so they don't stay logged in here
        const { signOut } = await import("@/lib/auth");
        await signOut();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen grid place-items-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="justify-center" />
          <div className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary border border-primary/40 px-3 py-1 rounded-full">
            <ShieldCheck size={12} /> Admin Console
          </div>
        </div>

        <div className="bg-card rounded-3xl p-10 border border-border shadow-soft">
          <h1 className="font-display text-3xl">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Restricted access. Administrators only.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
            <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />

            {error && (
              <p className="text-sm text-destructive bg-destructive/5 px-4 py-2 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-warm text-primary-foreground py-3.5 text-sm font-medium shadow-soft hover:shadow-luxe transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, type, value, onChange, autoComplete,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        required
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

export default AdminLoginPage;
