import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  bhk: string;
  size: string;
  status: "Ready to Move" | "Under Construction";
  type: "Apartment" | "Villa" | "Penthouse";
  image: string;
  featured?: boolean;
  amenities: string[];
  description: string;
};

export const properties: Property[] = [
  {
    id: "thara-skyline-residences",
    name: "Thara Skyline Residences",
    location: "Kokapet, Hyderabad",
    price: "₹1.25 Cr Onwards",
    bhk: "3 & 4 BHK",
    size: "1850 – 2640 sq.ft",
    status: "Under Construction",
    type: "Apartment",
    image: p1.src,
    featured: true,
    amenities: ["Infinity Pool", "Sky Lounge", "Clubhouse", "EV Charging", "24/7 Security"],
    description:
      "An iconic address rising above Kokapet — Thara Skyline Residences brings cinematic skyline views, hotel-grade amenities and master-crafted interiors to Hyderabad's fastest-growing financial corridor.",
  },
  {
    id: "thara-mirador-villas",
    name: "Thara Mirador Villas",
    location: "Tellapur, Hyderabad",
    price: "₹3.40 Cr Onwards",
    bhk: "4 & 5 BHK Villas",
    size: "3800 – 5200 sq.ft",
    status: "Ready to Move",
    type: "Villa",
    image: p2.src,
    featured: true,
    amenities: ["Private Pool", "Landscaped Garden", "Home Automation", "Servant Quarters"],
    description:
      "A gated enclave of 42 architect-designed villas — each home opens to a private pool, double-height living rooms, and quiet courtyards framed in travertine and oak.",
  },
  {
    id: "thara-aurum-towers",
    name: "Thara Aurum Towers",
    location: "Financial District, Hyderabad",
    price: "₹2.10 Cr Onwards",
    bhk: "3 BHK & Penthouses",
    size: "2100 – 4800 sq.ft",
    status: "Under Construction",
    type: "Penthouse",
    image: p3.src,
    featured: true,
    amenities: ["Sky Deck", "Concierge", "Spa & Salon", "Co-working Lounge"],
    description:
      "A 38-storey landmark with curated penthouses on the upper tiers. Floor-to-ceiling glass frames the entire Hyderabad skyline from your living room.",
  },
  {
    id: "thara-celeste",
    name: "Thara Celeste",
    location: "Gachibowli, Hyderabad",
    price: "₹95 L Onwards",
    bhk: "2 & 3 BHK",
    size: "1180 – 1720 sq.ft",
    status: "Ready to Move",
    type: "Apartment",
    image: p4.src,
    amenities: ["Rooftop Garden", "Yoga Pavilion", "Kids' Play Area", "Smart Homes"],
    description:
      "Thoughtfully designed homes for the new generation of urban families — close to IT hubs, international schools and the city's best dining.",
  },
];
