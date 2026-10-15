import Link from "next/link";
import { BusinessCard } from "@/components/business-card";
import { SearchForm } from "@/components/search-form";
import { ServiceIcon } from "@/components/service-icon";
import { findLocation, findService, getDirectoryData, matchesLocation } from "@/lib/directory";
import { isSupportedSearchLocation } from "@/lib/locations";

type SearchPageProps = { searchParams: { service?: string; location?: string } };

export const metadata = {
  title: "Find tech repair shops",
  description:
    "Search laptop, phone, computer and electronics repair shops by service and location.",
  alternates: { canonical: "/search" },
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const data = await getDirectoryData();
  const results = data.businesses.filter((business) => {
    const businessLocation = data.locations.find(
      (location) => location.slug === business.locationSlug,
    );
    return Boolean(
      businessLocation &&
      isSupportedSearchLocation(businessLocation, data.locations) &&
      (!searchParams.service || business.serviceSlugs.includes(searchParams.service)) &&
      matchesLocation(business.locationSlug, searchParams.location, data.locations),
    );
  });
  const service = searchParams.service ? findService(data, searchParams.service) : undefined;
  const location = searchParams.location ? findLocation(data, searchParams.location) : undefined;
  const title =
    service && location
      ? `${service.name} in ${location.name}`
      : service
        ? `${service.name} near you`
        : location
          ? `Tech repair in ${location.name}`
          : "All repair shops";

  return (
    <main className="min-h-[70vh]">
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-10 sm:py-14">
          <p className="eyebrow">Explore the directory</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-[-0.06em] text-ink sm:text-5xl">
            Find the right repair shop.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/60">
            Search by service and location, then compare local shops at a glance.
          </p>
          <div className="mt-6 max-w-4xl">
            <SearchForm compact defaultValues={searchParams} locations={data.locations} />
          </div>
        </div>
      </section>
      <section className="container-shell py-6 sm:py-12">
        <div className="flex flex-col justify-between gap-5 border-b border-ink/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-coral">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{title}</h2>
            <p className="mt-2 text-sm font-normal text-ink/55">
              Showing published starter listings. More shops are being added regularly.
            </p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-ink transition-colors hover:text-coral"
          >
            Clear search ×
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
            <p className="text-4xl">⌁</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em]">No repair shops yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/55">
              Try selecting a different service or location, or browse all listings.
            </p>
            <Link href="/search" className="button-dark mt-5">
              Reset filters
            </Link>
          </div>
        )}
        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
          <p className="eyebrow">Browse popular services</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.services.slice(0, 8).map((item) => (
              <Link
                key={item.slug}
                href={`/search?service=${item.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cloud px-4 py-2 text-sm font-medium text-ink/70 transition hover:border-lime hover:bg-lime hover:text-ink"
              >
                <ServiceIcon name={item.icon} className="h-4 w-4 text-forest/70" />
                {item.name}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-xs leading-6 text-ink/45">
            Choose a service and location above to find matching repair shops. Cebu is currently the
            only supported location.
          </p>
        </div>
      </section>
    </main>
  );
}
