import Link from "next/link";
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-warm-brown text-ivory">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 text-sm text-ivory/70 max-w-xs">
            Crafting landmark addresses across India — homes built on trust, design, and decades of craftsmanship.
          </p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Linkedin, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-ivory/80">
            <li><Link href="/properties" className="hover:text-primary">Properties</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Account</h4>
          <ul className="space-y-2.5 text-sm text-ivory/80">
            <li><Link href="/login" className="hover:text-primary">Login</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">My Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-primary">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-ivory/80">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-primary" /> Level 14, Knowledge City, Hyderabad 500081</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-primary" /> +91 90000 90000</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-primary" /> hello@thara.infra</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-luxe py-5 flex flex-col md:flex-row gap-2 justify-between text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} Thara Infra. All rights reserved.</p>
          <p>Designed in Hyderabad · RERA Registered</p>
        </div>
      </div>
    </footer>
  );
}
