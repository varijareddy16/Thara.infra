import Link from "next/link";
import { MapPin, Bed, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/supabase-types";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image_url}
          alt={property.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        {property.featured && (
          <span className="absolute top-4 left-4 bg-gradient-warm text-primary-foreground text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full">
            Featured
          </span>
        )}
        <span className="absolute top-4 right-4 bg-ivory/90 backdrop-blur text-warm-brown text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
          {property.status}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl text-foreground">{property.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin size={14} className="text-primary" />
          {property.location}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-warm-brown">
          <span className="flex items-center gap-1.5">
            <Bed size={14} /> {property.bhk}
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5">
            <Maximize2 size={14} /> {property.size}
          </span>
        </div>

        <div className="mt-5 pt-5 border-t border-border flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Starting
            </p>
            <p className="text-lg font-medium text-primary">{property.price}</p>
          </div>
          <span className="text-sm text-warm-brown group-hover:text-primary transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
