import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin";
import { resolveLocationId, shopRow, validateShopPayload } from "@/lib/admin-shops";

function unauthorized() {
  return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

  const { error } = await context.client
    .from("businesses")
    .update(shopRow(payload))
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { error: clearError } = await context.client
    .from("business_services")
    .delete()
    .eq("business_id", params.id);
  if (clearError) return NextResponse.json({ error: clearError.message }, { status: 400 });
  if (payload.serviceIds.length) {
    const { error: serviceError } = await context.client.from("business_services").insert(
      payload.serviceIds.map((serviceId) => ({
        business_id: params.id,
        service_id: serviceId,
      })),
    );
    if (serviceError) return NextResponse.json({ error: serviceError.message }, { status: 400 });
  }
  const { error: hoursError } = await context.client
    .from("business_hours")
    .upsert({ business_id: params.id, hours: payload.hours });
  if (hoursError) return NextResponse.json({ error: hoursError.message }, { status: 400 });
  return NextResponse.json({ id: params.id });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const context = await getAdminContext();
  if (!context) return unauthorized();
  const { error } = await context.client.from("businesses").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
