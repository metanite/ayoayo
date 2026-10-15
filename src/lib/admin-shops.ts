import type { BusinessHours, BusinessStatus } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ShopPayload = {
  slug: string;
  name: string;
  imageUrl: string;
  tagline: string;
  description: string;
  locationId: string;
  barangay: string;
  address: string;
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  hours: BusinessHours;
  latitude: number | null;
  longitude: number | null;
  status: BusinessStatus;
  verified: boolean;
  featured: boolean;
  serviceIds: string[];
};

const statuses = new Set<BusinessStatus>(["draft", "published", "unpublished", "flagged"]);

export async function resolveLocationId(client: SupabaseClient, value: string) {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    return { id: value };
  }

  const { data, error } = await client
    .from("locations")
    .select("id")
    .eq("slug", value.trim().toLowerCase())
    .maybeSingle();
  if (error) return { error: "Unable to validate the selected location." };
  if (!data) return { error: "Please select a valid Cebu city or municipality." };
  return { id: data.id };
}

export function validateShopPayload(input: unknown): { data?: ShopPayload; error?: string } {
  if (!input || typeof input !== "object") return { error: "Invalid shop payload." };
  const value = input as Record<string, unknown>;
  const required = ["slug", "name", "address", "locationId"];
  for (const field of required) {
    if (typeof value[field] !== "string" || !value[field]?.trim()) {
      return { error: `${field} is required.` };
    }
  }

  const status = value.status as BusinessStatus;
  if (!statuses.has(status)) return { error: "Invalid shop status." };
  const latitude = value.latitude === null || value.latitude === "" ? null : Number(value.latitude);
  const longitude =
    value.longitude === null || value.longitude === "" ? null : Number(value.longitude);
  if (latitude !== null && !Number.isFinite(latitude))
    return { error: "Latitude must be a number." };
  if (longitude !== null && !Number.isFinite(longitude))
    return { error: "Longitude must be a number." };

  return {
    data: {
      slug: String(value.slug).trim().toLowerCase(),
      name: String(value.name).trim(),
      imageUrl: String(value.imageUrl ?? "").trim(),
      tagline: String(value.tagline ?? "").trim(),
      description: String(value.description ?? "").trim(),
      locationId: String(value.locationId),
      barangay: String(value.barangay ?? "").trim(),
      address: String(value.address).trim(),
      phone: String(value.phone ?? "").trim(),
      website: String(value.website ?? "").trim(),
      facebook: String(value.facebook ?? "").trim(),
      instagram: String(value.instagram ?? "").trim(),
      hours: typeof value.hours === "object" && value.hours ? (value.hours as BusinessHours) : {},
      latitude,
      longitude,
      status,
      verified: Boolean(value.verified),
      featured: Boolean(value.featured),
      serviceIds: Array.isArray(value.serviceIds) ? value.serviceIds.map(String) : [],
    },
  };
}

export function shopRow(payload: ShopPayload) {
  const hasCoordinates = payload.latitude !== null && payload.longitude !== null;
  return {
    slug: payload.slug,
    name: payload.name,
    image_url: payload.imageUrl || null,
    tagline: payload.tagline || null,
    description: payload.description || null,
    location_id: payload.locationId,
    barangay: payload.barangay || null,
    address: payload.address,
    phone: payload.phone || null,
    website: payload.website || null,
    facebook: payload.facebook || null,
    instagram: payload.instagram || null,
    hours: payload.hours,
    coordinates: hasCoordinates
      ? `SRID=4326;POINT(${payload.longitude} ${payload.latitude})`
      : null,
    status: payload.status,
    verified: payload.verified,
    featured: payload.featured,
    updated_at: new Date().toISOString(),
  };
}
