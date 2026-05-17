import type { Metadata } from "next";
import HomePage from "@/views/home-page";

export const metadata: Metadata = {
  title: "Landmark Luxury Residences in Hyderabad",
  description:
    "Discover premium apartments, villas and penthouses by Thara Infra — built on trust, design and decades of craftsmanship.",
  openGraph: {
    title: "Thara Infra — Landmark Luxury Residences",
    description: "Premium homes across Hyderabad.",
  },
};

export default function Page() {
  return <HomePage />;
}
