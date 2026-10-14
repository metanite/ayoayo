import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ayoayo.ph"),
  title: { default: "ayoayo.ph — Find tech repair shops in Cebu", template: "%s | ayoayo.ph" },
  description:
    "Discover laptop, iPhone, computer and electronics repair shops across Cebu, Philippines.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ayoayo.ph — Find tech repair shops in Cebu",
    description: "A better way to find local tech repair in Cebu.",
    url: "https://ayoayo.ph",
    siteName: "ayoayo.ph",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="border-t border-ink/10 bg-white">
          <div className="container-shell flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-[-0.05em] text-ink">
                ayoayo<span className="text-coral">.ph</span>
              </p>
              <p className="mt-1 text-sm text-ink/50">Find the right tech repair in Cebu.</p>
            </div>
            <p className="text-sm text-ink/45">© 2026 ayoayo.ph</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
