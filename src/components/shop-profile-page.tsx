import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/business-card";
import { ServiceIcon } from "@/components/service-icon";
import { formatDate } from "@/lib/data";
import { findLocation, findService, getDirectoryData, matchesLocation } from "@/lib/directory";
import { locationPath, shopPath } from "@/lib/urls";

export type ShopProfileProps = { shopSlug: string; locationSlug?: string };

export async function generateShopMetadata(
  shopSlug: string,
  requestedLocationSlug?: string,
): Promise<Metadata> {
  const data = await getDirectoryData();
  const business = data.businesses.find((item) => item.slug === shopSlug);
  if (!business) return {};
  const location = findLocation(data, business.locationSlug);
  return {
    title: `${business.name} — ${location?.name ?? "Cebu"}`,
    description: business.description,
    alternates: {
      canonical: shopPath(requestedLocationSlug ?? business.locationSlug, business.slug),
    },
  };
}

export async function ShopProfilePage({ shopSlug, locationSlug }: ShopProfileProps) {
  const data = await getDirectoryData();
  const business = data.businesses.find((item) => item.slug === shopSlug);
  if (!business) notFound();
  if (locationSlug && !matchesLocation(business.locationSlug, locationSlug, data.locations)) {
    notFound();
  }
  const location = findLocation(data, business.locationSlug);
  const related = data.businesses
    .filter(
      (item) =>
        item.serviceSlugs.includes(business.serviceSlugs[0]) &&
        item.locationSlug === business.locationSlug,
    )
    .filter((item) => item.id !== business.id)
    .slice(0, 2);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, Cebu, Philippines`)}`;

  return (
    <main>
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-6 sm:py-12">
          <nav className="mb-6 text-sm text-ink/50">
            <Link href="/" className="hover:text-coral">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={locationPath(business.locationSlug) as Route} className="hover:text-coral">
              {location?.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/80">{business.name}</span>
          </nav>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime text-2xl font-semibold text-ink">
                {business.name.charAt(0)}
              </div>
              <p className="eyebrow">
                {location?.name} · {business.barangay}
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.06em] text-ink sm:text-5xl">
                {business.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/60">{business.tagline}</p>
            </div>
            {business.verified && (
              <span className="flex items-center gap-2 self-start rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink md:self-end">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  ✓
                </span>{" "}
                Listing verified
              </span>
            )}
          </div>
        </div>
      </section>
      <section className="container-shell grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_0.72fr]">
        <div>
          <p className="eyebrow">About this listing</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            {business.tagline}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-normal leading-8 text-ink/65">
            {business.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {business.serviceSlugs.map((slug) => {
              const service = findService(data, slug);
              return (
                <Link
                  href={`${locationPath(business.locationSlug)}/${slug}` as Route}
                  key={slug}
                  className="inline-flex items-center gap-2 rounded-full bg-cloud px-3.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-lime hover:text-ink"
                >
                  {service && (
                    <ServiceIcon name={service.icon} className="h-4 w-4 text-forest/70" />
                  )}
                  {service?.name}
                </Link>
              );
            })}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a href={`tel:${business.phone.replaceAll(" ", "")}`} className="button-dark">
              Call {business.phone} <span aria-hidden>↗</span>
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="button-lime">
              Get directions <span aria-hidden>↗</span>
            </a>
          </div>
          <p className="mt-4 text-xs text-ink/40">
            Last information check: {formatDate(business.updatedAt)}
          </p>
        </div>
        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-5 shadow-soft">
          <p className="eyebrow">Contact and location</p>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-[13px] font-medium text-ink/50">Address</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-[13px] font-normal leading-6 text-ink hover:text-coral"
              >
                {business.address}
                <br />
                {location?.name}, Cebu
              </a>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink/50">Hours</p>
              <p className="mt-1 text-[13px] font-normal text-ink">{business.hours}</p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-ink/50">Links</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/65 hover:border-lime hover:bg-lime"
                  >
                    Website
                  </a>
                )}
                {business.facebook && (
                  <a
                    href={business.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/65 hover:border-lime hover:bg-lime"
                  >
                    Facebook
                  </a>
                )}
                {business.instagram && (
                  <a
                    href={business.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink/65 hover:border-lime hover:bg-lime"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
          <a
            href={`mailto:hello@ayoayo.ph?subject=${encodeURIComponent(`Outdated information: ${business.name}`)}`}
            className="mt-6 block border-t border-ink/10 pt-4 text-xs font-semibold text-ink/45 hover:text-coral"
          >
            Report outdated information →
          </a>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-white">
          <div className="container-shell py-6 sm:py-12">
            <p className="eyebrow">More in {location?.name}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">Similar repair shops</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {related.map((item) => (
                <BusinessCard key={item.id} business={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
