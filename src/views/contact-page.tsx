"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Send, Check, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/supabase-queries";

function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitLead({
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        message: `${interest ? `Interested in: ${interest}\n` : ""}${message}`,
        source: "contact-page",
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container-luxe grid lg:grid-cols-[1fr_1.2fr] gap-14">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Get in Touch
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-balance">
            Let's talk about your next home.
          </h1>
          <p className="mt-5 text-muted-foreground max-w-md">
            Whether you're looking for your forever home or your next
            investment, our team is here to help you find the right Thara
            address.
          </p>

          <div className="mt-10 space-y-5">
            <Info
              icon={MapPin}
              title="Visit our HQ"
              text="Level 14, Knowledge City Tower B, Raidurg, Hyderabad 500081"
            />
            <Info
              icon={Phone}
              title="Call us"
              text="+91 90000 90000 · Mon–Sat 9am–7pm"
            />
            <Info icon={Mail} title="Email us" text="hello@thara.infra" />
          </div>
        </div>

        {success ? (
          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-soft flex flex-col items-center justify-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 grid place-items-center">
              <Check size={28} className="text-primary" />
            </div>
            <h2 className="font-display text-2xl">Message received</h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              Thank you for reaching out. Our team will get back to you within 4
              business hours.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setInterest("");
                setMessage("");
              }}
              className="text-sm text-primary hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-soft"
          >
            <h2 className="font-display text-2xl">Send us a message</h2>
            <p className="text-sm text-muted-foreground mt-1">
              We respond within 4 business hours.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Field
                label="First name"
                value={firstName}
                onChange={setFirstName}
                required
              />
              <Field
                label="Last name"
                value={lastName}
                onChange={setLastName}
              />
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                className="col-span-2"
                required
              />
              <Field
                label="Phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                className="col-span-2"
                required
              />
              <Field
                label="Interested in"
                placeholder="e.g. Thara Skyline Residences"
                value={interest}
                onChange={setInterest}
                className="col-span-2"
              />
              <label className="col-span-2 block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Message
                </span>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </label>
            </div>

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-warm text-primary-foreground py-4 text-sm font-medium hover:shadow-luxe transition-all disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={16} /> Send Enquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Mail;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="h-11 w-11 rounded-xl bg-cream flex items-center justify-center text-primary shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{text}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  className = "",
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

export default ContactPage;
