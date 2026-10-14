import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/business-card";
import { findLocation, findService, getDirectoryData } from "@/lib/directory";

type LandingPageProps = { params: { location: string; service: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const data = await getDirectoryData();
  const service = findService(data, params.service);
  const location = findLocation(data, params.location);
  if (!service || !location) return {};
  const title = `${service.name} in ${location.name}`;
  return {
    title,
    description: `${service.description} Browse local listings, contact details and locations for ${service.name.toLowerCase()} in ${location.name}.`,
    alternates: { canonical: `/${location.slug}/${service.slug}` },
    openGraph: { title: `${title} | ayoayo.ph`, description: service.description },
  };
}

export default async function ServiceLocationPage({ params }: LandingPageProps) {
  const data = await getDirectoryData();
  const service = findService(data, params.service);
  const location = findLocation(data, params.location);
  if (!service || !location) notFound();

  const results = data.businesses.filter(
    (business) =>
      business.serviceSlugs.includes(service.slug) &&
      (location.slug === "cebu" || business.locationSlug === location.slug),
  );
  const category = data.categories.find((item) => item.id === service.categoryId);
  const nearby = data.locations
    .filter((item) => item.slug !== location.slug && item.slug !== "cebu")
    .slice(0, 4);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${service.name} in ${location.name}`,
    numberOfItems: results.length,
    itemListElement: results.map((business, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://ayoayo.ph/business/${business.slug}`,
      name: business.name,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-10 sm:py-12">
          <nav className="mb-6 text-sm text-ink/50">
            <Link href="/" className="hover:text-coral">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-coral">
              Cebu tech repair
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/80">{service.name}</span>
          </nav>
          <p className="eyebrow">
            {category?.name} · {location.type}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.06em] text-ink sm:text-5xl">
            {service.name} in {location.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/60">
            {service.description} Find local providers, compare their details and contact a shop
            near you.
          </p>
        </div>
      </section>
      <section className="container-shell py-10 sm:py-12">
        <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-coral">
              {results.length} local {results.length === 1 ? "listing" : "listings"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              {service.name} near {location.name}
            </h2>
          </div>
          <Link
            href={`/search?service=${service.slug}&location=${location.slug}`}
            className="button-dark"
          >
            Refine results <span aria-hidden>→</span>
          </Link>
        </div>
        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center">
            <h3 className="text-2xl font-semibold tracking-[-0.05em]">
              No listings in this area yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/55">
              Browse nearby areas or search all of Cebu for {service.name.toLowerCase()}.
            </p>
            <Link href={`/search?service=${service.slug}`} className="button-dark mt-5">
              Search all Cebu
            </Link>
          </div>
        )}
        <div className="mt-12 grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">About this search</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">
              Looking for {service.name.toLowerCase()} in {location.name}?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-ink/60">
              Use ayoayo.ph to find repair shops that serve {location.name} and nearby Cebu
              communities. Call ahead to confirm parts availability, turnaround time and service
              coverage before visiting.
            </p>
          </div>
          <div className="rounded-2xl bg-cloud p-5">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink/60">
              Explore nearby areas
            </p>
            <div className="mt-4 space-y-3">
              {nearby.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}/${service.slug}`}
                  className="flex items-center justify-between border-b border-ink/10 pb-3 text-sm font-semibold transition-colors hover:text-coral"
                >
                  <span>
                    {service.name} in {item.name}
                  </span>
                  <span aria-hidden>↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
