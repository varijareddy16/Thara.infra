"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  MapPin,
  Bed,
  Maximize2,
  Download,
  MessageCircle,
  Phone,
  Check,
  Loader2,
} from "lucide-react";
import { useProperty, useProperties, submitLead } from "@/lib/supabase-queries";
import { PropertyCard } from "@/components/PropertyCard";

function PropertyDetail() {
  const params = useParams();
  const slug = params?.id as string | undefined;
  const { data: property, isLoading, error } = useProperty(slug ?? "");
  const { data: allProperties = [] } = useProperties();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!slug || error || !property) {
    notFound();
  }

  const similar = allProperties
    .filter((p) => p.slug !== property.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-gradient-ivory">
        <div className="container-luxe pt-10 pb-6">
          <Link href="/properties"
            className="text-sm text-warm-brown hover:text-primary"
          >
            ← Back to properties
          </Link>
        </div>

        <div className="container-luxe grid lg:grid-cols-[2fr_1fr] gap-3 pb-10">
          <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-muted">
            <img
              src={property.image_url}
              alt={property.name}
              className="h-full w-full object-cover"
              width={1280}
              height={800}
            />
          </div>
          <div className="grid grid-rows-2 gap-3">
            {[property.image_url, property.image_url].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-muted">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxe grid lg:grid-cols-[2fr_1fr] gap-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">
              {property.status}
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl text-balance">
              {property.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} className="text-primary" /> {property.location}
            </p>

            <div className="mt-8 flex flex-wrap gap-8 py-6 border-y border-border">
              <Spec icon={Bed} label="Configuration" value={property.bhk} />
              <Spec icon={Maximize2} label="Size" value={property.size} />
              <Spec label="Type" value={property.type} />
              <Spec label="Starting Price" value={property.price} accent />
            </div>

            <h2 className="mt-12 font-display text-2xl">About this residence</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              {property.description}
            </p>

            <h2 className="mt-12 font-display text-2xl">Amenities</h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3">
              {property.amenities.map((a: string) => (
                <li
                  key={a}
                  className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3"
                >
                  <Check size={16} className="text-primary" />
                  <span className="text-sm">{a}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl">Floor plans</h2>
            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="aspect-[4/5] rounded-2xl border border-border bg-cream flex flex-col items-center justify-center text-warm-brown"
                >
                  <span className="font-display text-2xl">Plan {n}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {1180 + n * 200} sq.ft
                  </span>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl">Location</h2>
            <div className="mt-5 aspect-[16/8] rounded-2xl bg-cream border border-border flex items-center justify-center text-warm-brown">
              <div className="text-center">
                <MapPin size={28} className="text-primary mx-auto" />
                <p className="mt-2 font-display text-xl">{property.location}</p>
                <p className="text-xs text-muted-foreground">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Sticky inquiry card */}
          <aside className="lg:sticky lg:top-28 self-start bg-card border border-border rounded-2xl p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Starting Price
            </p>
            <p className="mt-1 font-display text-3xl text-gradient-warm">
              {property.price}
            </p>

            <InquiryForm
              propertyId={property.id}
              propertyName={property.name}
            />

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-ivory py-3 text-sm text-warm-brown hover:bg-cream">
                <Download size={14} /> Brochure
              </button>
              <a
                href={`https://wa.me/919000090000?text=Hi, I'm interested in ${encodeURIComponent(property.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white py-3 text-sm"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>
            <a
              href="tel:+919000090000"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 text-sm text-warm-brown hover:text-primary"
            >
              <Phone size={14} /> +91 90000 90000
            </a>
          </aside>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-luxe">
          <h2 className="font-display text-3xl md:text-4xl">
            Similar residences
          </h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Inquiry form ─────────────────────────────────────────────────────────────

function InquiryForm({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
        name,
        email,
        phone,
        message,
        property_id: propertyId,
        property_name: propertyName,
        source: "property-detail",
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mt-6 p-5 rounded-xl bg-primary/10 border border-primary/20 text-center">
        <Check size={24} className="text-primary mx-auto" />
        <p className="mt-2 font-medium text-foreground">
          Thank you! We'll call you back shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm"
        placeholder="Full name"
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm"
        placeholder="Phone number"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm"
        placeholder="Email (optional)"
      />
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm"
        placeholder="I'd like to know more about…"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-warm text-primary-foreground py-3.5 text-sm font-medium disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Sending…
          </>
        ) : (
          "Request a Callback"
        )}
      </button>
    </form>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon?: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
        {Icon ? <Icon size={12} /> : null}
        {label}
      </p>
      <p
        className={`mt-1 font-display text-xl ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default PropertyDetail;
