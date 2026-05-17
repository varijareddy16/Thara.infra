"use client";

import Link from "next/link";
import { useState, type FormEvent, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { signIn, signUp, useSession, useProfile } from "@/lib/auth";
import { Loader2 } from "lucide-react";

type Mode = "login" | "signup";

function LoginPage() {
  const { session, loading: sessionLoading } = useSession();
  const { profile, loading: profileLoading } = useProfile();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  // If already logged in, redirect based on role from DB
  useEffect(() => {
    if (sessionLoading || profileLoading) return;
    if (!session || !profile) return;

    if (profile.role === "admin") {
      window.location.replace("/admin");
    } else {
      window.location.replace("/dashboard");
    }
  }, [session, profile, sessionLoading, profileLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        // signIn fetches role from DB and returns it directly
        const { role } = await signIn(email, password);
        if (role === "admin") {
          window.location.replace("/admin");
        } else {
          window.location.replace("/dashboard");
        }
      } else {
        await signUp(email, password, name);
        setSignupDone(true);
        setSubmitting(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (sessionLoading || (session && profileLoading)) {
    return (
      <div className="min-h-[80vh] grid place-items-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (signupDone) {
    return (
      <section className="min-h-[80vh] grid place-items-center py-16">
        <div className="w-full max-w-md bg-card rounded-3xl p-10 border border-border shadow-soft text-center">
          <Logo className="justify-center" />
          <h1 className="mt-8 font-display text-3xl">Account created</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your account is ready. Sign in to continue.
          </p>
          <button
            onClick={() => { setSignupDone(false); setMode("login"); }}
            className="mt-6 rounded-full bg-gradient-warm text-primary-foreground px-6 py-2.5 text-sm font-medium"
          >
            Sign In
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] grid place-items-center py-16">
      <div className="w-full max-w-md bg-card rounded-3xl p-10 border border-border shadow-soft">
        <Logo />
        <h1 className="mt-8 font-display text-3xl">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "login"
            ? "Sign in to your Thara account."
            : "Join Thara Infra to track your enquiries."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <Field label="Full name" type="text" value={name} onChange={setName} autoComplete="name" />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gradient-warm text-primary-foreground py-3.5 text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="text-warm-brown hover:text-primary"
          >
            {mode === "login" ? "Create account" : "Already have an account?"}
          </button>
          {mode === "login" && (
            <Link href="/contact" className="text-warm-brown hover:text-primary">
              Forgot password?
            </Link>
          )}
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

export default LoginPage;
