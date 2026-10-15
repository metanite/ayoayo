export const LOCATION_URL_SUFFIX = "-tech-repair-shops";

export function locationPath(locationSlug: string) {
  return `/${locationSlug}${LOCATION_URL_SUFFIX}`;
}

export function shopPath(locationSlug: string, shopSlug: string) {
  return `${locationPath(locationSlug)}/tech-repair-shop/${shopSlug}`;
}

export function locationSlugFromPath(pathSlug: string) {
  return pathSlug.endsWith(LOCATION_URL_SUFFIX)
    ? pathSlug.slice(0, -LOCATION_URL_SUFFIX.length)
    : pathSlug;
}
