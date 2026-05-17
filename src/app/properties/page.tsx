import type { Metadata } from "next";
import PropertiesPage from "@/views/properties-page";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Explore Thara Infra's portfolio of luxury apartments, villas and penthouses across Hyderabad.",
};

export default function Page() {
  return <PropertiesPage />;
}
