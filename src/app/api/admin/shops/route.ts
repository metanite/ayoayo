import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin";
import { resolveLocationId, shopRow, validateShopPayload } from "@/lib/admin-shops";
import { REMOVED_SERVICE_SLUGS } from "@/lib/directory";

function unauthorized() {
  return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
}

export async function GET() {
  const context = await getAdminContext();
  if (!context) return unauthorized();

  const [shopsResult, servicesResult, locationsResult] = await Promise.all([
    context.client
      .from("businesses")
      .select("*, locations(id, name, slug), business_services(service_id)")
      .order("created_at", { ascending: false }),
    context.client
      .from("services")
      .select("id, name, slug, category_id")
      .eq("is_active", true)
      .order("name"),
    context.client.from("locations").select("id, name, slug, type").order("name"),
  ]);
  if (shopsResult.error || servicesResult.error || locationsResult.error) {
    return NextResponse.json({ error: "Unable to load admin data." }, { status: 500 });
  }

  const activeServices = (servicesResult.data ?? []).filter(
    (service: any) => !REMOVED_SERVICE_SLUGS.has(service.slug),
  );
  const activeServiceIds = new Set(activeServices.map((service: any) => service.id));

  return NextResponse.json({
    shops: (shopsResult.data ?? []).map((shop: any) => ({
      ...shop,
      location: Array.isArray(shop.locations) ? shop.locations[0] : shop.locations,
      serviceIds: (shop.business_services ?? [])
        .map((item: any) => item.service_id)
        .filter((serviceId: string) => activeServiceIds.has(serviceId)),
      latitude: shop.coordinates?.coordinates?.[1] ?? null,
      longitude: shop.coordinates?.coordinates?.[0] ?? null,
    })),
    services: activeServices,
    locations: locationsResult.data ?? [],
  });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return unauthorized();
  const validation = validateShopPayload(await request.json().catch(() => null));
  if (validation.error || !validation.data) {
    return NextResponse.json({ error: validation.error ?? "Invalid shop." }, { status: 400 });
  }
  const location = await resolveLocationId(context.client, validation.data.locationId);
  if (location.error || !location.id) {
    return NextResponse.json({ error: location.error ?? "Invalid location." }, { status: 400 });
  }
  const payload = { ...validation.data, locationId: location.id };

  const { data: shop, error } = await context.client
    .from("businesses")
    .insert(shopRow(payload))
    .select("id")
    .single();
  if (error || !shop)
    return NextResponse.json(
      { error: error?.message ?? "Unable to create shop." },
      { status: 400 },
    );

  if (payload.serviceIds.length) {
    const { error: serviceError } = await context.client.from("business_services").insert(
      payload.serviceIds.map((serviceId) => ({
        business_id: shop.id,
        service_id: serviceId,
      })),
    );
    if (serviceError) return NextResponse.json({ error: serviceError.message }, { status: 400 });
  }
  const { error: hoursError } = await context.client
    .from("business_hours")
    .upsert({ business_id: shop.id, hours: payload.hours });
  if (hoursError) return NextResponse.json({ error: hoursError.message }, { status: 400 });
  return NextResponse.json({ id: shop.id }, { status: 201 });
}
