import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/content/site";
import { buildSiteGraph } from "@/lib/structured-data";

import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

const verification =
  googleVerification || bingVerification
    ? {
        ...(googleVerification ? { google: googleVerification } : {}),
        ...(bingVerification
          ? { other: { "msvalidate.01": bingVerification } }
          : {}),
      }
    : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role} in ${site.shortLocation}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: `${site.name} — ${site.role}`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role} in ${site.shortLocation}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role} in ${site.shortLocation}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(verification ? { verification } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0b0f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-ZA"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <body>
        <JsonLd data={buildSiteGraph()} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          >
            Skip to content
          </a>
          <SiteSidebar />
          <SiteHeader />
          <div className="lg:pl-[17rem]">{children}</div>
          <ScrollToTop />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
