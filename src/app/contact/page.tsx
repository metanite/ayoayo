import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact the ayoayo.ph team about tech-repair listings and directory updates.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-[70vh]">
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-10 sm:py-16">
          <p className="eyebrow">Contact us</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.06em] text-ink sm:text-6xl">
            We’d love to hear from you.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/60">
            Send us a note about a shop listing, a correction, a partnership or anything that can
            make ayoayo.ph more useful.
          </p>
        </div>
      </section>
      <section className="container-shell grid gap-6 py-8 sm:py-14 md:grid-cols-2">
        <div className="rounded-3xl bg-forest p-6 text-white sm:p-8">
          <p className="eyebrow text-lime">Email</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Say hello</h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            For general questions, listing updates and collaboration inquiries, email us at
            hello@ayoayo.ph.
          </p>
          <a href="mailto:hello@ayoayo.ph" className="button-lime mt-6">
            hello@ayoayo.ph <span aria-hidden>↗</span>
          </a>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
          <p className="eyebrow text-coral">Looking for a shop?</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-ink">
            Browse the Cebu directory.
          </h2>
          <p className="mt-4 text-sm leading-7 text-ink/60">
            Search by repair service or browse shops by Cebu location to find the right place to
            contact.
          </p>
          <Link href="/search" className="button-dark mt-6">
            Find a repair shop <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
