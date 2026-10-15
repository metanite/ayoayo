"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { locations as demoLocations, services } from "@/lib/data";
import { PickerOption, ServicePicker } from "@/components/service-picker";
import type { Location } from "@/lib/types";
import { getSupportedSearchLocations } from "@/lib/locations";
import { locationPath } from "@/lib/urls";

type SearchFormProps = {
  compact?: boolean;
  defaultValues?: { service?: string; location?: string };
  locations?: Location[];
  showCebuAreas?: boolean;
};

const serviceOptions: PickerOption[] = services.map((service) => ({
  name: service.name,
  slug: service.slug,
  icon: service.icon,
  description: service.description,
}));

export function SearchForm({
  compact = false,
  defaultValues = {},
  locations = demoLocations,
  showCebuAreas = false,
}: SearchFormProps) {
  const router = useRouter();
  const supportedLocations = getSupportedSearchLocations(locations);
  const locationOptions: PickerOption[] = (
    showCebuAreas
      ? supportedLocations
      : supportedLocations.filter((location) => location.slug === "cebu")
  ).map((location) => ({
    name: location.name,
    slug: location.slug,
    icon: "location",
  }));

  function submit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const location = String(formData.get("location") ?? "");
    if (!location) return;

    event.preventDefault();
    const service = String(formData.get("service") ?? "");
    const destination = service
      ? `${locationPath(location)}/${encodeURIComponent(service)}`
      : locationPath(location);
    router.push(destination as Route);
  }

  return (
    <form
      action="/search"
      onSubmit={submit}
      className={compact ? "search-panel search-panel-compact" : "search-panel"}
    >
      <div className="search-field">
        <label htmlFor={compact ? "compact-service" : "service"}>Service</label>
        <ServicePicker
          id={compact ? "compact-service" : "service"}
          name="service"
          ariaLabel="Choose a service"
          defaultValue={defaultValues.service}
          options={serviceOptions}
          allLabel="All services"
          allIcon="all"
        />
      </div>
      <div className="search-field">
        <label htmlFor={compact ? "compact-location" : "location"}>Location</label>
        <ServicePicker
          id={compact ? "compact-location" : "location"}
          name="location"
          ariaLabel="Choose a location"
          defaultValue={defaultValues.location ?? ""}
          options={locationOptions}
          allLabel="All locations"
          allIcon="location"
        />
      </div>
      <button type="submit" className="button-lime search-submit">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </span>
        <span>Search</span>
      </button>
    </form>
  );
}
