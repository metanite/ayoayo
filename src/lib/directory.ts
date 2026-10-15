import {
  businesses as demoBusinesses,
  categories as demoCategories,
  locations as demoLocations,
  services as demoServices,
} from "@/lib/data";
import type { Business, BusinessHours, Category, Location, Service } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabase";

export const REMOVED_SERVICE_SLUGS = new Set([
  "console-repair",
  "cctv-repair",
  "networking-repair",
]);

function first<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

function coordinates(value: unknown): { latitude: number; longitude: number } {
  const point = value as { coordinates?: [number, number] } | null;
  return {
    latitude: point?.coordinates?.[1] ?? 0,
    longitude: point?.coordinates?.[0] ?? 0,
  };
}

function formatHours(hours: unknown): string {
  if (typeof hours === "string") return hours;
  if (!hours || typeof hours !== "object") return "Contact shop for hours";
  const entries = Object.entries(hours as BusinessHours).filter(([, value]) => value);
  if (!entries.length) return "Contact shop for hours";
  const firstValue = entries[0][1];
  if (entries.every(([, value]) => value === firstValue)) return `Every day · ${firstValue}`;
  return entries.map(([day, value]) => `${day} · ${value}`).join(" · ");
}

function mapBusiness(row: any): Business {
  const location = first(row.locations);
  const linkedServices = (row.business_services ?? [])
    .map((item: any) => ({ id: item.service_id, service: first(item.services) }))
    .filter((item: any) => item.service?.slug && !REMOVED_SERVICE_SLUGS.has(item.service.slug));
  const point = coordinates(row.coordinates);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    image: row.image_url ?? undefined,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    locationSlug: location?.slug ?? "cebu",
    locationName: location?.name,
    barangay: row.barangay ?? "",
    address: row.address,
    phone: row.phone ?? "",
    website: row.website ?? undefined,
    facebook: row.facebook ?? undefined,
    instagram: row.instagram ?? undefined,
    hours: formatHours(row.hours),
    latitude: point.latitude,
    longitude: point.longitude,
    serviceSlugs: linkedServices.map((item: any) => item.service.slug),
    serviceNames: Object.fromEntries(
      linkedServices.map((item: any) => [item.service.slug, item.service.name]),
    ),
    verified: Boolean(row.verified),
    featured: Boolean(row.featured),
    updatedAt: row.updated_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export type DirectoryData = {
  categories: Category[];
  services: Service[];
  locations: Location[];
  businesses: Business[];
};

function logDirectoryErrors(
  results: Array<{
    name: string;
    error: { code?: string; message: string; hint?: string | null } | null;
  }>,
) {
  const failures = results
    .filter((result) => result.error)
    .map(({ name, error }) => ({
      table: name,
      code: error?.code,
      message: error?.message,
      hint: error?.hint,
    }));
  if (failures.length) console.error("[directory] Supabase read failed", failures);
}

export async function getDirectoryData(): Promise<DirectoryData> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      categories: demoCategories,
      services: demoServices.filter((service) => !REMOVED_SERVICE_SLUGS.has(service.slug)),
      locations: demoLocations,
      businesses: demoBusinesses,
    };
  }

  const [categoryResult, serviceResult, locationResult, businessResult] = await Promise.all([
    client
      .from("categories")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .order("sort_order"),
    client
      .from("services")
      .select("id, category_id, name, slug, description, keywords")
      .eq("is_active", true)
      .order("name"),
    client
      .from("locations")
      .select("id, parent_id, name, slug, type, description, coordinates")
      .eq("is_active", true)
      .order("name"),
    client
      .from("businesses")
      .select("*, locations(slug, name), business_services(service_id, services(slug, name))")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("name"),
  ]);

  logDirectoryErrors([
    { name: "categories", error: categoryResult.error },
    { name: "services", error: serviceResult.error },
    { name: "locations", error: locationResult.error },
    { name: "businesses", error: businessResult.error },
  ]);

  const locationRows = locationResult.data ?? [];
  const locationById = new Map(locationRows.map((item: any) => [item.id, item.slug]));
  const serviceRows = serviceResult.data ?? [];
  const services: Service[] = serviceRows
    .filter((item: any) => !REMOVED_SERVICE_SLUGS.has(item.slug))
    .map((item: any) => ({
      id: item.id,
      categoryId: item.category_id,
      name: item.name,
      slug: item.slug,
      icon: "all",
      description: item.description ?? "",
      keywords: item.keywords ?? [],
    }));
  const locations: Location[] = locationResult.error
    ? demoLocations
    : locationRows.map((item: any) => ({
        slug: item.slug,
        name: item.name,
        type: item.type,
        parentSlug: item.parent_id ? locationById.get(item.parent_id) : undefined,
        description: item.description ?? "",
        ...coordinates(item.coordinates),
      }));
  const categories: Category[] = categoryResult.error
    ? demoCategories
    : (categoryResult.data ?? []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description ?? "",
      }));

  const businesses = businessResult.error
    ? demoBusinesses
    : (businessResult.data ?? []).map(mapBusiness);

  return {
    categories,
    services: serviceResult.error
      ? demoServices.filter((service) => !REMOVED_SERVICE_SLUGS.has(service.slug))
      : services,
    locations,
    businesses,
  };
}

export function findService(data: DirectoryData, slug: string) {
  return data.services.find((service) => service.slug === slug);
}

export function findLocation(data: DirectoryData, slug: string) {
  return data.locations.find((location) => location.slug === slug);
}

export function matchesLocation(
  businessLocationSlug: string,
  locationSlug: string | undefined,
  locations: Location[],
) {
  if (!locationSlug) return true;
  if (businessLocationSlug === locationSlug) return true;

  const bySlug = new Map(locations.map((location) => [location.slug, location]));
  let current = bySlug.get(businessLocationSlug);
  while (current?.parentSlug) {
    if (current.parentSlug === locationSlug) return true;
    current = bySlug.get(current.parentSlug);
  }
  return false;
}
