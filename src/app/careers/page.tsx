import type { Metadata } from "next";
import CareersPage from "@/views/careers-page";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Thara Infra — current openings across architecture, engineering, sales and operations.",
};

export default function Page() {
  return <CareersPage />;
}
