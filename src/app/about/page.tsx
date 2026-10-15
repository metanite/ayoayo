import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ayoayo.ph",
  description: "Learn how ayoayo.ph helps people find local tech repair shops in Cebu.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-[70vh]">
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-10 sm:py-16">
          <p className="eyebrow">About ayoayo.ph</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.06em] text-ink sm:text-6xl">
            Find the right shop for the fix.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/60">
            ayoayo.ph is a local directory for people looking for dependable laptop, phone, computer
            and electronics repair shops.
          </p>
        </div>
      </section>
      <section className="container-shell grid gap-8 py-8 sm:py-14 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Our focus</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            Local information, made easier to compare.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-ink/65">
            <p>
              We bring repair-shop details into one place so you can compare services, locations,
              contact details and hours before making a trip.
            </p>
            <p>
              We currently support Cebu, with plans to expand to more locations as the directory
              grows. Shop owners and customers can help us keep listings useful by sharing updates
              and corrections.
            </p>
          </div>
          <Link href={"/cebu-tech-repair-shops"} className="button-dark mt-7">
            Browse Cebu shops <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="rounded-3xl bg-forest p-6 text-white sm:p-8">
          <p className="eyebrow text-lime">What you can find</p>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-white/70">
            <li>• Local shop profiles and contact details</li>
            <li>• Repair services by device and need</li>
            <li>• Cebu location and municipality filters</li>
            <li>• Direct links to call, visit or learn more</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
