"use client";

import { useMemo, useState } from "react";
import { BusinessCard } from "@/components/business-card";
import { getSupportedSearchLocations, SUPPORTED_LOCATION_ROOT } from "@/lib/locations";
import type { Business, Location } from "@/lib/types";

type LocationShopResultsProps = {
  businesses: Business[];
  locations: Location[];
  locationName: string;
  showAreaFilters?: boolean;
};

export function LocationShopResults({
  businesses,
  locations,
  locationName,
  showAreaFilters = false,
}: LocationShopResultsProps) {
  const [selectedLocation, setSelectedLocation] = useState(SUPPORTED_LOCATION_ROOT);
  const areaOptions = useMemo(
    () =>
      getSupportedSearchLocations(locations).filter(
        (location) =>
          location.slug !== SUPPORTED_LOCATION_ROOT &&
          businesses.some((business) => business.locationSlug === location.slug),
      ),
    [businesses, locations],
  );
  const filteredBusinesses =
    !showAreaFilters || selectedLocation === SUPPORTED_LOCATION_ROOT
      ? businesses
      : businesses.filter((business) => business.locationSlug === selectedLocation);
  const selectedArea = areaOptions.find((area) => area.slug === selectedLocation);
  const resultLocationName = selectedArea?.name ?? locationName;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-coral">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? "shop" : "shops"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            Local repair shops near {resultLocationName}
          </h2>
        </div>
      </div>
      {showAreaFilters && (
        <div className="border-b border-ink/10 py-5">
          <p className="mb-3 text-sm font-semibold text-ink">Filter by Cebu municipality or city</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter shops by Cebu area">
            <button
              type="button"
              aria-pressed={selectedLocation === SUPPORTED_LOCATION_ROOT}
              onClick={() => setSelectedLocation(SUPPORTED_LOCATION_ROOT)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedLocation === SUPPORTED_LOCATION_ROOT ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40"}`}
            >
              All Cebu
            </button>
            {areaOptions.map((area) => (
              <button
                key={area.slug}
                type="button"
                aria-pressed={selectedLocation === area.slug}
                onClick={() => setSelectedLocation(area.slug)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedLocation === area.slug ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40"}`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {filteredBusinesses.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((shop) => (
            <BusinessCard key={shop.id} business={shop} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-[-0.05em]">No shops listed yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/55">
            Try another Cebu municipality or browse all Cebu shops.
          </p>
        </div>
      )}
    </>
  );
}
