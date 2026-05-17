import type { Metadata } from "next";
import DashboardPage from "@/views/dashboard-page";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
