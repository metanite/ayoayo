"use client";

import { useState } from "react";
import { BusinessCard } from "@/components/business-card";
import { locations, businesses } from "@/lib/data";

const municipalities = locations.filter((location) => location.slug !== "cebu");

export function LandingDirectory() {
  const [selectedMunicipality, setSelectedMunicipality] = useState("all");
  const filteredBusinesses =
    selectedMunicipality === "all"
      ? businesses
      : businesses.filter((business) => business.locationSlug === selectedMunicipality);

  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="container-shell py-10 sm:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Repair shops in Cebu</p>
            <h2 className="section-title">Find a place to start.</h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-7 text-ink/60">
              Browse local shops, compare their services, and contact the one that fits.
            </p>
          </div>
          <a href="/search" className="font-semibold text-ink transition-colors hover:text-coral">
            View all shops <span aria-hidden>→</span>
          </a>
        </div>
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-ink">Filter by municipality</p>
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            role="group"
            aria-label="Filter repair shops by municipality"
          >
            <button
              type="button"
              aria-pressed={selectedMunicipality === "all"}
              onClick={() => setSelectedMunicipality("all")}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedMunicipality === "all" ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40"}`}
            >
              All municipalities
            </button>
            {municipalities.map((municipality) => (
              <button
                key={municipality.slug}
                type="button"
                aria-pressed={selectedMunicipality === municipality.slug}
                onClick={() => setSelectedMunicipality(municipality.slug)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedMunicipality === municipality.slug ? "border-ink bg-ink text-white" : "border-ink/15 bg-white text-ink/70 hover:border-ink/40"}`}
              >
                {municipality.name}
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
              Try another municipality or view all shops in Cebu.
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
