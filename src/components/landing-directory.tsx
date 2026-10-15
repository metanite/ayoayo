"use client";

import { useState } from "react";
import { BusinessCard } from "@/components/business-card";
import type { Business, Location } from "@/lib/types";
import { getSupportedSearchLocations, isSupportedSearchLocation } from "@/lib/locations";
import { locationPath } from "@/lib/urls";

export function LandingDirectory({
  businesses,
  locations,
}: {
  businesses: Business[];
  locations: Location[];
}) {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const supportedLocations = getSupportedSearchLocations(locations).filter(
    (location) => location.slug === "cebu",
  );
  const supportedBusinesses = businesses.filter((business) => {
    const location = locations.find((item) => item.slug === business.locationSlug);
    return location ? isSupportedSearchLocation(location, locations) : false;
  });
  const filteredBusinesses =
    selectedLocation === "all"
      ? supportedBusinesses
      : supportedBusinesses.filter((business) => {
          if (business.locationSlug === selectedLocation) return true;
          let location = locations.find((item) => item.slug === business.locationSlug);
          while (location?.parentSlug) {
            if (location.parentSlug === selectedLocation) return true;
            location = locations.find((item) => item.slug === location?.parentSlug);
          }
          return false;
        });

  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="container-shell py-6 sm:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Featured repair shops</p>
            <h2 className="section-title">Find a place to start.</h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-7 text-ink/60">
              Browse local shops, compare their services, and contact the one that fits.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href={locationPath("cebu")}
              className="font-semibold text-ink transition-colors hover:text-coral"
            >
              Browse Cebu shops <span aria-hidden>→</span>
            </a>
            <a
              href="/search"
              className="font-semibold text-ink/60 transition-colors hover:text-coral"
            >
              View all shops <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-ink">Filter by location</p>
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            role="group"
            aria-label="Filter repair shops by location"
          >
            <button
              type="button"
              aria-pressed={selectedLocation === "all"}
              onClick={() => setSelectedLocation("all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedLocation === "all" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40"}`}
            >
              All locations
            </button>
            {supportedLocations.map((location) => (
              <button
                key={location.slug}
                type="button"
                aria-pressed={selectedLocation === location.slug}
                onClick={() => setSelectedLocation(location.slug)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedLocation === location.slug ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40"}`}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>
        {filteredBusinesses.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-ink/15 bg-cloud p-8 text-center">
            <h3 className="text-xl font-semibold">No repair shops listed yet</h3>
            <p className="mt-2 text-sm font-normal text-ink/60">
              Try another location or view all shops.
            </p>
            <a href="/search" className="button-dark mt-5">
              View all shops
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
