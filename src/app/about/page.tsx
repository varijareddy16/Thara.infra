import type { Metadata } from "next";
import AboutPage from "@/views/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Thara Infra is an 18-year-old developer crafting landmark residences across Hyderabad.",
};

export default function Page() {
  return <AboutPage />;
}
