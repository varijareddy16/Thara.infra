"use client";

import { Award, Compass, Heart, Users } from "lucide-react";
import img from "@/assets/property-4.jpg";

const values = [
  { icon: Heart, title: "Built with Care", text: "We treat every home as if our own family will live in it." },
  { icon: Award, title: "Award-Winning", text: "Recognised by CREDAI, NAREDCO and Architecture+Design India." },
  { icon: Compass, title: "Long-term Thinking", text: "We choose locations and partners for the next 50 years, not the next quarter." },
  { icon: Users, title: "Owner-Centric", text: "A dedicated relationship manager from booking to handover and beyond." },
];

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-ivory py-20">
        <div className="container-luxe">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">About Thara Infra</span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-balance max-w-3xl">
            Eighteen years of building homes Hyderabad calls landmarks.
          </h1>
          <p className="mt-6 text-muted-foreground max-w-2xl text-lg">
            Thara Infra was founded in 2007 with one belief — that a home should appreciate in every sense
            of the word. Today, we're one of South India's most trusted developers, with 42 projects, 6.8M
            sq.ft delivered, and 12,000+ families calling a Thara address home.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-luxe grid lg:grid-cols-2 gap-14 items-center">
          <div className="rounded-3xl overflow-hidden aspect-[5/6] shadow-luxe">
            <img
              src={typeof img === "string" ? img : img.src}
              alt="Thara Infra interior"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Our Story</span>
            <h2 className="mt-3 font-display text-4xl text-balance">A developer for the next generation.</h2>
            <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
              <p>What began as a single 24-apartment project in Banjara Hills has grown into a portfolio
                spanning Hyderabad's most prestigious corridors — Kokapet, Tellapur, Gachibowli and the Financial District.</p>
              <p>Through three real-estate cycles and two pandemics, we've never missed a delivery date. That
                track record is the foundation everything else is built on.</p>
              <p>Our second generation of leadership is now driving a quieter revolution — bringing sustainability,
                home automation and timeless design into every Thara residence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="container-luxe">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Our Values</span>
            <h2 className="mt-3 font-display text-4xl text-balance">What we hold ourselves to.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-ivory rounded-2xl p-6 border border-border hover-lift">
                <div className="h-11 w-11 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground">
                  <v.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
