"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useProperties } from "@/lib/supabase-queries";
import { PropertyCard } from "@/components/PropertyCard";

function PropertiesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">(
    "featured"
  );

  const { data: allProperties = [], isLoading } = useProperties();

  const filtered = useMemo(() => {
    let list = allProperties.filter((p) => {
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.location.toLowerCase().includes(q.toLowerCase());
      const matchesS = status === "All" || p.status === status;
      const matchesT = type === "All" || p.type === type;
      return matchesQ && matchesS && matchesT;
    });

    const priceNum = (p: (typeof allProperties)[number]) =>
      Number(p.price.replace(/[^\d.]/g, "")) *
      (p.price.includes("Cr") ? 100 : 1);

    if (sort === "price-asc")
      list = [...list].sort((a, b) => priceNum(a) - priceNum(b));
    if (sort === "price-desc")
      list = [...list].sort((a, b) => priceNum(b) - priceNum(a));
    if (sort === "featured")
      list = [...list].sort(
        (a, b) => Number(!!b.featured) - Number(!!a.featured)
      );

    return list;
  }, [allProperties, q, status, type, sort]);

  return (
    <>
      <section className="bg-gradient-ivory pt-16 pb-12 border-b border-border">
        <div className="container-luxe">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Portfolio
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-balance">
            Our residences
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            From skyline penthouses to gated villa enclaves — explore current
            and upcoming Thara projects.
          </p>

          <div className="mt-10 bg-card rounded-2xl border border-border p-3 shadow-soft grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or location…"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Select
              value={status}
              onChange={setStatus}
              options={["All", "Ready to Move", "Under Construction"]}
              label="Status"
            />
            <Select
              value={type}
              onChange={setType}
              options={["All", "Apartment", "Villa", "Penthouse"]}
              label="Type"
            />
            <Select
              value={sort}
              onChange={(v) => setSort(v as typeof sort)}
              options={[
                { value: "featured", label: "Featured" },
                { value: "price-asc", label: "Price ↑" },
                { value: "price-desc", label: "Price ↓" },
              ]}
              label="Sort"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxe">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-card border border-border animate-pulse h-80"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-20 text-muted-foreground">
              No properties match your filters.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

type Opt = string | { value: string; label: string };
function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  label: string;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-ivory text-sm px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 pr-9"
      >
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lab = typeof o === "string" ? o : o.label;
          return (
            <option key={val} value={val}>
              {label}: {lab}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default PropertiesPage;
