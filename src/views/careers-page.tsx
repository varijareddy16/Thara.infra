"use client";

import Link from "next/link";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { useCareers } from "@/lib/supabase-queries";

function CareersPage() {
  const { data: openings = [], isLoading } = useCareers();

  return (
    <>
      <section className="bg-gradient-ivory py-20">
        <div className="container-luxe max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Careers
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-balance">
            Build the addresses that shape a city.
          </h1>
          <p className="mt-5 text-muted-foreground text-lg">
            We're a team of architects, engineers, designers and storytellers —
            building the homes Hyderabad will be remembered for. Come build with
            us.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxe">
          <h2 className="font-display text-3xl">Open positions</h2>

          {isLoading && (
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 rounded-xl bg-card border border-border animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && openings.length === 0 && (
            <p className="mt-8 text-muted-foreground">
              No open positions right now. Check back soon.
            </p>
          )}

          {!isLoading && openings.length > 0 && (
            <div className="mt-8 divide-y divide-border border-y border-border">
              {openings.map((o) => (
                <div
                  key={o.id}
                  className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 group"
                >
                  <div>
                    <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                      {o.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={12} /> {o.department} · {o.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} /> {o.location}
                      </span>
                    </div>
                    {o.description && (
                      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                        {o.description}
                      </p>
                    )}
                  </div>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-warm-brown hover:text-primary shrink-0"
                  >
                    Apply <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default CareersPage;
