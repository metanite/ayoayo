import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/business-card";
import { ServiceIcon } from "@/components/service-icon";
import { formatDate } from "@/lib/data";
import { findLocation, findService, getDirectoryData, matchesLocation } from "@/lib/directory";
import { locationPath, shopPath } from "@/lib/urls";

export type ShopProfileProps = { shopSlug: string; locationSlug?: string };

function getShopKeywords(
  business: Awaited<ReturnType<typeof getDirectoryData>>["businesses"][number],
  data: Awaited<ReturnType<typeof getDirectoryData>>,
  locationName: string,
) {
  const serviceKeywords = business.serviceSlugs.flatMap((slug) => {
    const service = findService(data, slug);
    return service ? [service.name, ...service.keywords] : [];
  });
  return Array.from(
    new Set([
      business.name,
      `${business.name} ${locationName}`,
      ...serviceKeywords,
      ...business.serviceSlugs.map((slug) => `${slug.replaceAll("-", " ")} in ${locationName}`),
    ]),
  );
}

export async function generateShopMetadata(
  shopSlug: string,
  requestedLocationSlug?: string,
): Promise<Metadata> {
  const data = await getDirectoryData();
  const business = data.businesses.find((item) => item.slug === shopSlug);
  if (!business) return {};
  const location = findLocation(data, business.locationSlug);
  const locationName = location?.name ?? "Cebu";
  const keywords = getShopKeywords(business, data, locationName);
  return {
    title: `${business.name} — ${locationName}`,
    description: business.description,
    keywords,
    alternates: {
      canonical: shopPath(requestedLocationSlug ?? business.locationSlug, business.slug),
    },
    openGraph: {
      title: `${business.name} — ${locationName}`,
      description: business.description,
      type: "website",
      images: business.image ? [{ url: business.image, alt: `${business.name} shop` }] : undefined,
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
  const locationName = location?.name ?? "Cebu";
  const keywords = getShopKeywords(business, data, locationName);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, Cebu, Philippines`)}`;
  const hasCoordinates =
    Number.isFinite(business.latitude) &&
    Number.isFinite(business.longitude) &&
    (business.latitude !== 0 || business.longitude !== 0);
  const mapPadding = 0.008;
  const openStreetMapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${[
        business.longitude - mapPadding,
        business.latitude - mapPadding,
        business.longitude + mapPadding,
        business.latitude + mapPadding,
      ]
        .map((value) => value.toFixed(6))
        .join(
          ",",
        )}&layer=mapnik&marker=${business.latitude.toFixed(6)}%2C${business.longitude.toFixed(6)}`
    : undefined;
  const openStreetMapLink = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=17/${business.latitude}/${business.longitude}`
    : undefined;

  return (
    <main>
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-4 sm:py-7">
          <nav className="mb-4 text-xs text-ink/50 sm:text-sm">
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
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="min-w-0">
              <p className="eyebrow">
                {locationName} · {business.barangay}
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-[1.05] tracking-[-0.06em] text-ink sm:text-4xl">
                {business.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/60 sm:text-lg">
                {business.tagline}
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-ink/45">
                {keywords.slice(1, 6).join(" · ")}
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 md:w-[26rem] md:flex-row-reverse">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-ink/10 bg-cloud shadow-soft sm:h-64">
                <Image
                  src={business.image ?? "/brand/repair-shop-placeholder.svg"}
                  alt={`${business.name} shop`}
                  fill
                  unoptimized
                  sizes="(max-width: 767px) 100vw, 416px"
                  className="object-cover"
                />
              </div>
              {business.verified && (
                <span className="flex items-center gap-2 rounded-full bg-lime px-3 py-2 text-xs font-semibold text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    ✓
                  </span>
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="container-shell grid gap-8 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-start">
        <div className="min-w-0">
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
          <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
            <p className="eyebrow">Contact &amp; directions</p>
            <div className="mt-5 space-y-5">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[13px] font-medium text-ink/50">Phone</p>
                  <a
                    href={`tel:${business.phone.replaceAll(" ", "")}`}
                    className="mt-1 block text-[13px] font-semibold text-ink hover:text-coral"
                  >
                    {business.phone || "Phone not listed"}
                  </a>
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
              <div className="grid gap-3 sm:grid-cols-2">
                <a href={`tel:${business.phone.replaceAll(" ", "")}`} className="button-dark">
                  Call {business.phone} <span aria-hidden>↗</span>
                </a>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="button-lime">
                  Get directions <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink/40">
              Last information check: {formatDate(business.updatedAt)}
            </p>
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-3 shadow-soft sm:p-4">
          <div className="flex items-center justify-between gap-4 px-2 pb-3">
            <div>
              <p className="eyebrow">OpenStreetMap</p>
              <p className="mt-1 text-sm font-semibold text-ink">Shop map</p>
            </div>
            {hasCoordinates && (
              <span className="text-right text-[11px] leading-4 text-ink/40">
                {business.latitude.toFixed(5)}, {business.longitude.toFixed(5)}
              </span>
            )}
          </div>
          {openStreetMapUrl && openStreetMapLink ? (
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-cloud">
              <iframe
                title={`${business.name} location map`}
                src={openStreetMapUrl}
                className="h-[22rem] w-full border-0"
                loading="lazy"
              />
              <div className="flex items-center justify-between gap-3 border-t border-ink/10 bg-white px-3 py-3 text-xs">
                <span className="text-ink/45">Map data © OpenStreetMap contributors</span>
                <a
                  href={openStreetMapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 font-semibold text-coral hover:text-ink"
                >
                  Open larger map ↗
                </a>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-ink/15 bg-cloud p-5 text-sm text-ink/55">
              Map coordinates are not available for this listing yet.
            </p>
          )}
        </aside>
      </section>
      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-white">
          <div className="container-shell py-6 sm:py-12">
            <p className="eyebrow">More in {location?.name}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">Similar repair shops</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {related.map((item) => (
                <BusinessCard key={item.id} business={item} showHours={false} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
