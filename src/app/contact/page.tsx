import type { Metadata } from "next";
import ContactPage from "@/views/contact-page";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Thara Infra team — book a site visit, request a brochure or speak to a relationship manager.",
};

export default function Page() {
  return <ContactPage />;
}
