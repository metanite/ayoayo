import type { Location } from "@/lib/types";

export const SUPPORTED_LOCATION_ROOT = "cebu";

const SEARCH_LOCATION_TYPES = new Set<Location["type"]>(["city", "municipality"]);

export function isSupportedSearchLocation(location: Location, locations: Location[]) {
  if (location.slug === SUPPORTED_LOCATION_ROOT) {
    return location.type === "province";
  }
  if (!SEARCH_LOCATION_TYPES.has(location.type)) return false;

  const locationsBySlug = new Map(locations.map((item) => [item.slug, item]));
  const visited = new Set<string>();
  let parentSlug = location.parentSlug;

  while (parentSlug && !visited.has(parentSlug)) {
    if (parentSlug === SUPPORTED_LOCATION_ROOT) return true;
    visited.add(parentSlug);
    parentSlug = locationsBySlug.get(parentSlug)?.parentSlug;
  }

  return false;
}

export function getSupportedSearchLocations(locations: Location[]) {
  return locations
    .filter((location) => isSupportedSearchLocation(location, locations))
    .sort((a, b) => {
      if (a.slug === SUPPORTED_LOCATION_ROOT) return -1;
      if (b.slug === SUPPORTED_LOCATION_ROOT) return 1;
      return a.name.localeCompare(b.name);
    });
}
