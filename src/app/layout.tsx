import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles.css";
import { Providers } from "@/components/providers";
import { PublicShell } from "@/components/public-shell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Thara Infra — Premium Real Estate in Hyderabad",
    template: "%s — Thara Infra",
  },
  description:
    "Thara Infra crafts landmark residences across Hyderabad — luxury apartments, villas and penthouses built on trust, design and craftsmanship.",
  authors: [{ name: "Thara Infra" }],
  openGraph: {
    title: "Thara Infra — Premium Real Estate",
    description: "Landmark luxury residences across Hyderabad.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
        <Script id="crisp-chat" strategy="afterInteractive">
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="ebd01166-8f37-4bab-9df6-138ccfd5af90";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
        </Script>
      </body>
    </html>
  );
}
