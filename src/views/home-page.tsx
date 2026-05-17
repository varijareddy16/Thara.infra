"use client";

import Link from "next/link";
import { Search, Building2, Shield, Sparkles, Award, TrendingUp, Quote, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-building.jpg";
import { useProperties } from "@/lib/supabase-queries";
import { PropertyCard } from "@/components/PropertyCard";

const stats = [
  { value: "18+", label: "Years of Craftsmanship" },
  { value: "42", label: "Landmark Projects" },
  { value: "6.8M", label: "Sq.Ft Delivered" },
  { value: "12K+", label: "Happy Families" },
];

const whyUs = [
  { icon: Shield, title: "Built on Trust", text: "RERA-registered, on-time delivery and transparent documentation across every project." },
  { icon: Sparkles, title: "Designed for Detail", text: "Architecture and interiors by award-winning studios — every doorway is a deliberate choice." },
  { icon: Award, title: "Premium Craftsmanship", text: "Imported finishes, marble, joinery and fixtures sourced from the world's most trusted ateliers." },
  { icon: TrendingUp, title: "Investor-Grade Locations", text: "Addresses chosen for long-term capital appreciation along Hyderabad's growth corridors." },
];

const testimonials = [
  { quote: "Moving into a Thara home felt like checking into a private hotel — except it's permanent. Every detail considered.", name: "Anika & Rahul Mehta", project: "Thara Mirador Villas" },
  { quote: "The most transparent developer we've worked with. Handover happened exactly as promised, down to the date.", name: "Vikram Reddy", project: "Thara Skyline Residences" },
  { quote: "Our second Thara home. The resale value of the first one made the decision for us.", name: "Pooja Iyer", project: "Thara Celeste" },
];

function HomePage() {
  const { data: allProperties = [] } = useProperties({ featured: true });
  const featured = allProperties;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={typeof heroImg === "string" ? heroImg : heroImg.src}
            alt="Luxury Thara Infra residence at golden hour"
            className="h-full w-full object-cover animate-slow-zoom"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-brown/30 via-warm-brown/10 to-ivory" />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/50 to-transparent" />
        </div>

        <div className="relative container-luxe pt-28 md:pt-40 pb-24">
          <div className="max-w-2xl fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory/15 backdrop-blur border border-ivory/20 px-4 py-1.5 text-xs tracking-[0.25em] uppercase text-ivory">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Hyderabad's Most Awarded Developer
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl text-ivory text-balance leading-[1.05]">
              Homes that hold their value <em className="text-primary not-italic">— for generations.</em>
            </h1>
            <p className="mt-6 text-lg text-ivory/85 max-w-xl">
              Thara Infra crafts landmark residences across Hyderabad — designed by architects you'd hire,
              built by hands you can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-warm px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-luxe hover:translate-y-[-2px] transition-transform"
              >
                Explore Properties <ArrowRight size={16} />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-ivory/40 bg-ivory/10 backdrop-blur px-7 py-3.5 text-sm font-medium text-ivory hover:bg-ivory hover:text-warm-brown transition-colors"
              >
                Schedule a Visit
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-14 md:mt-20 max-w-4xl bg-ivory/95 backdrop-blur rounded-2xl border border-border shadow-luxe p-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Location", value: "Hyderabad" },
              { label: "Property Type", value: "All Types" },
              { label: "Budget", value: "Any Budget" },
            ].map((f) => (
              <div key={f.label} className="px-4 py-3 border-r border-border last:border-r-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{f.label}</p>
                <p className="mt-1 text-sm text-foreground">{f.value}</p>
              </div>
            ))}
            <Link href="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-warm text-primary-foreground text-sm font-medium px-6 py-4"
            >
              <Search size={16} /> Search
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative -mt-2 py-20 bg-ivory">
        <div className="container-luxe grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:border-r last:border-r-0 border-border">
              <p className="font-display text-5xl text-gradient-warm">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-warm-brown">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-24 bg-gradient-ivory">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Currently Selling</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance max-w-2xl">
                Featured residences across Hyderabad
              </h2>
            </div>
            <Link href="/properties" className="text-sm text-warm-brown hover:text-primary flex items-center gap-1.5">
              View all properties <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* WHY THARA */}
      <section className="py-24 bg-cream">
        <div className="container-luxe grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Why Thara Infra</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
              Built for the families who notice the details.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-lg">
              We design every project as if we were going to live there ourselves. Often, we do.
              That's why our residences hold their value — and our owners come back.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {whyUs.map((item) => (
              <div key={item.title} className="bg-ivory rounded-2xl p-6 border border-border hover-lift">
                <div className="h-11 w-11 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground">
                  <item.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTOR GROWTH */}
      <section className="py-24 bg-warm-brown text-ivory">
        <div className="container-luxe grid lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Investor Growth</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance text-ivory">
              An average <span className="text-primary">23.4%</span> annual appreciation across our portfolio.
            </h2>
            <p className="mt-5 text-ivory/75 max-w-2xl">
              Across the last decade, Thara homes in Kokapet, Tellapur and the Financial District have outpaced
              Hyderabad's market index by a clear margin — driven by location strategy, build quality, and
              long-term planning.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "₹4,200/sqft", l: "Avg. launch price (2018)" },
              { v: "₹11,800/sqft", l: "Current resale value" },
              { v: "180%", l: "Capital appreciation" },
              { v: "98.6%", l: "On-time delivery rate" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-ivory/15 bg-ivory/5 p-5">
                <p className="font-display text-2xl text-primary">{s.v}</p>
                <p className="mt-1 text-xs text-ivory/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-ivory">
        <div className="container-luxe">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Owners' Words</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-balance">
              Trusted by families across Hyderabad.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="bg-card rounded-2xl p-7 border border-border hover-lift">
                <Quote size={22} className="text-primary" />
                <blockquote className="mt-4 text-foreground/85 leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-border">
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.project}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-ivory">
        <div className="container-luxe">
          <div className="relative rounded-3xl bg-gradient-warm p-10 md:p-16 overflow-hidden shadow-luxe">
            <Building2 className="absolute -right-10 -bottom-10 text-primary-foreground/10" size={280} />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl text-primary-foreground text-balance">
                Visit a Thara home this weekend.
              </h2>
              <p className="mt-4 text-primary-foreground/90">
                Our experience centres in Kokapet, Tellapur and the Financial District are open daily.
                Tour our model homes, walk the grounds, and meet the team behind the craft.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-full bg-ivory text-warm-brown px-7 py-3.5 text-sm font-medium hover:bg-cream transition-colors">
                  Book a Site Visit
                </Link>
                <Link href="/properties" className="rounded-full border border-ivory/40 text-ivory px-7 py-3.5 text-sm font-medium hover:bg-ivory/10 transition-colors">
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
