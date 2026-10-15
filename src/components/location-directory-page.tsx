import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocationShopResults } from "@/components/location-shop-results";
import { SearchForm } from "@/components/search-form";
import { findLocation, getDirectoryData, matchesLocation } from "@/lib/directory";
import { isSupportedSearchLocation, SUPPORTED_LOCATION_ROOT } from "@/lib/locations";
import { locationPath } from "@/lib/urls";

export async function generateLocationMetadata(locationSlug: string): Promise<Metadata> {
  const data = await getDirectoryData();
  const location = findLocation(data, locationSlug);
  if (!location) return {};
  return {
    title: `Repair shops in ${location.name}`,
    description: `Find laptop, phone, computer and electronics repair shops in ${location.name}.`,
    alternates: { canonical: locationPath(location.slug) },
  };
}

export async function LocationDirectoryPage({ locationSlug }: { locationSlug: string }) {
  const data = await getDirectoryData();
  const location = findLocation(data, locationSlug);
  if (!location || !isSupportedSearchLocation(location, data.locations)) notFound();

  const results = data.businesses.filter((shop) =>
    matchesLocation(shop.locationSlug, location.slug, data.locations),
  );

  return (
    <main className="min-h-[70vh]">
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-10 sm:py-14">
          <p className="eyebrow">Location directory</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.06em] text-ink sm:text-5xl">
            Repair shops in {location.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/60">
            {location.description} Browse local shops by service and compare their details in one
            place.
          </p>
          <div className="mt-6 max-w-4xl">
            <SearchForm
              compact
              defaultValues={{ location: location.slug }}
              locations={data.locations}
              showCebuAreas
            />
          </div>
        </div>
      </section>
      <section className="container-shell py-6 sm:py-12">
        <LocationShopResults
          businesses={results}
          locations={data.locations}
          locationName={location.name}
          showAreaFilters={location.slug === SUPPORTED_LOCATION_ROOT}
        />
        <div className="mt-6 flex justify-end">
          <Link href="/search" className="button-dark">
            Search Cebu locations <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-12 border-t border-ink/10 pt-8">
          <p className="eyebrow">Browse by service</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.services.map((service) => (
              <Link
                key={service.slug}
                href={`${locationPath(location.slug)}/${service.slug}` as Route}
                className="rounded-full border border-ink/10 bg-cloud px-4 py-2 text-sm font-medium text-ink/70 transition hover:border-lime hover:bg-lime hover:text-ink"
              >
                {service.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
